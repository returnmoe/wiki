---
id: diffusion-models
title: Diffusion Models
summary: Generative machine-learning models that learn to reverse a gradual corruption process, transforming noise into structured data through iterative denoising.
locale: en
kind: concept
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - Diffusion
  - Diffusion model
  - Denoising diffusion model
  - Denoising diffusion probabilistic model
  - Score-based generative model
redirects:
  - diffusion
  - diffusion-model
  - denoising-diffusion-model
  - ddpm
  - score-based-generative-model
related:
  - model-training
  - stable-diffusion
  - stable-diffusion-xl
  - watermark-removal-as-a-denoising-task
infobox:
  fields:
    - key: type
      value: Generative-model family
    - key: debut
      value: '2015'
---

**Diffusion models** are generative machine-learning models that learn to transform a simple random
distribution, usually Gaussian noise, into samples resembling their training data. They are trained
with the reverse of a deliberately destructive process: a known **forward process** gradually adds
noise to data, and a neural network learns how to remove that corruption at many noise levels. To
generate a new sample, a sampler starts from fresh noise and repeatedly applies the learned reverse
updates.[^thermodynamics][^ddpm]

The term usually refers to **denoising diffusion probabilistic models** (DDPMs), score-based
generative models, and their discrete- or continuous-time variants. These formulations are closely
connected rather than wholly separate methods. A DDPM describes a finite Markov chain, a score model
learns the gradient of a sequence of noisy data densities, and a stochastic-differential-equation
formulation expresses both in continuous time.[^score-model][^score-sde]

Diffusion is a modeling and training framework, not a particular neural-network architecture and not
a synonym for text-to-image generation. A denoiser can be a convolutional U-Net, a transformer, or a
domain-specific network; it can operate on pixels, compressed latent representations, waveforms,
three-dimensional coordinates, or discrete symbols.[^latent-diffusion][^dit][^d3pm] Stable Diffusion
is therefore one application of latent diffusion, not the definition of diffusion in machine
learning.

This article concerns generative diffusion. The word also appears in unrelated or only loosely
related techniques such as diffusion maps, graph diffusion, and diffusion-based message passing.

## The model at a glance

A standard diffusion system separates several components that are often conflated:

| Component                 | Role                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| Data representation `x_0` | The object modeled: pixels, an autoencoder latent, audio samples, coordinates, or tokens    |
| Forward process `q`       | A fixed corruption rule that maps data toward a simple terminal distribution                |
| Denoising network         | Predicts noise, clean data, velocity, a score, or reverse-transition parameters             |
| Noise or time schedule    | Specifies the corruption strength at each training time                                     |
| Condition `c`             | Optional information such as a class, text embedding, low-resolution input, or known region |
| Sampler or solver         | Numerically turns terminal noise into a sample using the trained network                    |
| Decoder                   | In latent diffusion, maps the final compressed representation back into the original domain |

Only the denoising network and any encoders or decoders are normally learned. The forward process
is chosen by the designer. The sampler is an inference algorithm, so one trained checkpoint may be
compatible with several samplers and step schedules. Changing a sampler can alter speed and output
characteristics without retraining the denoiser.[^ddim][^dpm-solver]

## Historical development

The modern generative formulation was introduced in 2015 by Jascha Sohl-Dickstein and colleagues.
Inspired by nonequilibrium thermodynamics, their method slowly destroyed structure in data and
learned a reverse process to restore it.[^thermodynamics] A parallel line of work trained neural
networks to estimate the **score**—the gradient of the log data density—and sampled with annealed
Langevin dynamics across several noise levels.[^score-model]

In 2020, Jonathan Ho, Ajay Jain, and Pieter Abbeel presented DDPMs with a simplified noise-prediction
objective that produced high-quality images and exposed a close connection between diffusion and
denoising score matching.[^ddpm] Continuous-time work subsequently placed score models and diffusion
probabilistic models in a common stochastic-differential-equation framework, including both
stochastic reverse-time sampling and a deterministic probability-flow ordinary differential
equation.[^score-sde]

Later work improved reverse variances, schedules, architectures, conditioning, and numerical
solvers. Diffusion models became competitive with leading GAN image generators in selected
benchmarks, while latent diffusion moved the expensive iterative process from pixels into a smaller
autoencoder representation.[^improved-ddpm][^guided-diffusion][^latent-diffusion] These results
established diffusion as a broad generative-model family.

## Forward diffusion

Let `x_0` be a clean training example. A common discrete Gaussian process corrupts it over `T` steps:

```text
q(x_t | x_(t-1)) = Normal(sqrt(1 - beta_t) x_(t-1), beta_t I)
```

Here, `beta_t` is a small positive variance chosen by a **noise schedule**. Define
`alpha_t = 1 - beta_t` and `alpha_bar_t` as the product of `alpha_1` through `alpha_t`. Gaussian
composition then gives a direct expression for any time step:[^ddpm]

```text
q(x_t | x_0) = Normal(sqrt(alpha_bar_t) x_0, (1 - alpha_bar_t) I)

x_t = sqrt(alpha_bar_t) x_0 + sqrt(1 - alpha_bar_t) epsilon
epsilon ~ Normal(0, I)
```

At early times, `x_t` retains most of the sample. At late times, it is dominated by noise. The
schedule is chosen so that the terminal distribution `q(x_T)` is close to a simple prior such as a
standard normal distribution.

The closed form is operationally important: training does not need to add noise one step at a time.
A training program can select a random time `t`, draw one `epsilon`, and construct `x_t` directly.
The long chain primarily appears during generation, where reverse updates depend on the result of
the preceding update.[^ddpm]

The forward process does not discover how real data becomes noisy, and it is not intended to be a
realistic physical degradation model. It creates a ladder of easier, noise-smoothed distributions
between complex data and a tractable prior. Other corruption families are possible. Discrete
diffusion, for example, can replace Gaussian noise with transition matrices that randomly substitute
or mask categories.[^d3pm]

## Learning the reverse process

The exact reverse conditional `q(x_(t-1) | x_t)` depends on the unknown data distribution. A DDPM
approximates it with learned Gaussian transitions:

```text
p_theta(x_(t-1) | x_t, c) = Normal(mu_theta(x_t, t, c), Sigma_theta(x_t, t, c))
```

The optional `c` is a condition. The network may predict the reverse mean and variance directly, but
common parameterizations instead predict the added noise `epsilon`, the clean example `x_0`, or a
linear combination sometimes called velocity. Given the schedule, these quantities can be converted
into one another, although their loss weighting and numerical behavior differ across noise
levels.[^ddpm][^progressive-distillation][^edm]

In the widely used noise-prediction form, training minimizes a weighted version of:

```text
L_simple = E[x_0, t, epsilon] ||epsilon - epsilon_theta(x_t, t, c)||^2
```

A typical step of [model training](/model-training/) therefore consists of five operations:

1. Draw clean data `x_0` and, if applicable, its condition `c`.
2. Draw a time `t` and independent Gaussian noise `epsilon`.
3. Construct `x_t` directly from `x_0`, `t`, and `epsilon`.
4. Ask the network to predict the target from `x_t`, `t`, and `c`.
5. Backpropagate the prediction error and update the network's parameters.

This resembles supervised regression because the program manufactures an exact target from each
unlabeled example. It is nevertheless normally **self-supervised**: no person needs to label the
correct noise. Conditional generation may additionally require paired labels, captions, or other
conditioning data.

The original probabilistic derivation optimizes a variational lower bound on data log-likelihood.
The simplified mean-squared error changes the weighting of its terms and was selected for sample
quality in the DDPM experiments. Later work combined simplified and variational objectives and
learned reverse variances to improve likelihood and reduce the number of sampling evaluations.[^ddpm][^improved-ddpm]

### The score interpretation

For a noisy marginal distribution `p_t(x)`, its **score** is the vector field

```text
s(x, t) = gradient_x log p_t(x)
```

This is not a quality score or a probability. It points locally toward increasing log density. A
noise-conditioned network can learn this field through denoising score matching without evaluating
the normalized density itself. For the common Gaussian perturbation, the predicted noise and score
are proportional, with a scale and sign determined by the noise standard deviation.[^score-model]

This explains why “predicting noise” can generate structure. The network is not expected to recover
the particular random noise as if it were encrypted information. Across many corrupted examples, the
optimal denoising prediction encodes a statistical direction toward regions that are more plausible
under the training distribution. Repeating such local corrections transports a random point toward
the learned data distribution.

### The continuous-time interpretation

A forward stochastic differential equation can write gradual corruption as

```text
dx = f(x, t) dt + g(t) dw
```

where `dw` is Brownian noise. Its reverse-time SDE depends on the score of each noisy marginal:

```text
dx = [f(x, t) - g(t)^2 gradient_x log p_t(x)] dt + g(t) d(w_reverse)
```

Time runs from noise back toward data in the second expression. Replacing the unknown score with a
neural estimate yields a generative process. The same marginals can also be followed by the
deterministic **probability-flow ODE**, whose score term has a factor of one half.[^score-sde]

This view separates the learned field from the numerical path used to integrate it. It also shows
why a diffusion-derived sampler can be stochastic or deterministic. DDPM, score-based SDE, and ODE
language often describe different discretizations or parameterizations of closely connected models,
not three unrelated inventions.

## Generation and sampling

An ancestral DDPM sampler starts with `x_T` drawn from the terminal prior and evaluates the network
from `T` down to `1`. At each step, it forms a less noisy `x_(t-1)` and usually injects the variance
specified by the reverse transition. Every network evaluation operates on all spatial positions or
sequence positions in parallel, but the evaluations themselves are sequential because each consumes
the previous state.[^ddpm]

The original schedule may contain hundreds or thousands of training times, but inference need not
visit all of them. Sampling methods make different speed–quality–diversity trade-offs:

- **DDPM ancestral sampling** follows stochastic reverse transitions and can produce different
  trajectories even from an intermediate state.
- **DDIM** constructs non-Markovian forward processes with the same training objective. Its
  deterministic setting maps a fixed initial noise tensor to a repeatable result and can use a much
  shorter sequence of times.[^ddim]
- **SDE predictors and correctors** numerically integrate a reverse SDE, optionally alternating a
  prediction step with score-based corrections.[^score-sde]
- **Probability-flow and dedicated diffusion ODE solvers** use deterministic integration. DPM-Solver,
  for example, analytically handles part of the diffusion ODE and approximates the remaining neural
  integral with a higher-order method.[^dpm-solver]
- **Distillation and consistency methods** train a student to approximate a long trajectory in one
  or a few evaluations. Consistency models can be distilled from diffusion models or trained as a
  separate generative family.[^progressive-distillation][^consistency-models]

“Steps” is therefore incomplete performance information. One step may require one or more denoiser
evaluations, commonly reported as **number of function evaluations** (NFE). Wall-clock latency also
depends on model size, resolution, batch size, guidance, hardware, and implementation. A solver that
works well for one parameterization or guidance scale may not preserve quality for another, and
fewer evaluations are not automatically better.

The random seed normally determines the initial noise and any later stochastic draws. It does not
select a complete image already hidden inside the noise. The output arises from the interaction of
that random state, the learned distribution, the condition, guidance, and the numerical sampler.

## Conditioning and guidance

An unconditional model approximates `p(x)`. A conditional model approximates `p(x | c)`, where `c`
could represent a class, text, another modality, a low-resolution sample, a mask, or observed values.
The denoiser receives an encoding of `c` through mechanisms such as concatenation, cross-attention,
or adaptive normalization. The reverse process then uses the condition at every selected noise
level.[^latent-diffusion][^dit]

**Classifier guidance** combines a diffusion score with gradients from a separate classifier trained
to recognize the desired condition in noisy inputs. Increasing the classifier contribution can
improve conditional fidelity while reducing diversity.[^guided-diffusion]

**Classifier-free guidance** (CFG) avoids the separate classifier. During training, the model sees
both conditioned examples and examples whose condition has been dropped. At inference, it combines
conditional and unconditional predictions, schematically:

```text
guided = unconditioned + guidance_scale * (conditioned - unconditioned)
```

The difference estimates a direction associated with the condition. Amplifying it often improves
prompt or class adherence, but it changes the sampled distribution and trades diversity for
fidelity. Very strong guidance can produce artifacts or exaggerated features. Formula conventions
for the reported scale differ, so scales are not necessarily comparable across implementations.[^cfg]

Diffusion also supports conditional restoration and editing. Inpainting can preserve observed
regions while sampling missing ones; super-resolution conditions on a smaller input; and image-to-
image generation can begin from a noised representation of an input rather than from pure terminal
noise. These operations are probabilistic when several outputs can plausibly satisfy the same
evidence, unlike a point-estimate regression system that is trained to return one
answer.[^palette][^sdedit]

## Data representations and network architectures

### Pixel and data-space diffusion

A data-space model applies corruption and denoising directly to the object being generated. For an
image, `x_t` is an image-sized pixel tensor; for waveform synthesis, it can be a sequence of audio
samples. This avoids a separately trained compression model, but repeated network evaluation at full
dimensionality makes high-resolution generation expensive.[^ddpm][^diffwave]

### Latent diffusion

A **latent diffusion model** first trains or obtains an autoencoder. Its encoder maps data `x` to a
smaller continuous representation `z`; diffusion models the distribution of `z`; and the decoder
maps a sampled `z` back to data. The reduction in spatial size and dimensionality lowers the cost of
each denoising evaluation. Cross-attention can condition the latent denoiser on text or other
inputs.[^latent-diffusion]

This design is a composition of two models. Its output cannot preserve distinctions discarded by the
autoencoder, and reconstruction error places an upper bound on details recoverable through the
latent route. Latent diffusion should not be confused with the broader observation that a DDPM is
mathematically a latent-variable model whose intermediate noisy states are latent variables.

### U-Nets and diffusion transformers

Early image DDPMs commonly used U-Nets: multiscale convolutional networks with skip connections,
attention, and an embedding of the current time. The U-Net is a practical denoiser architecture, not
a requirement of the probabilistic formulation.[^ddpm]

Diffusion Transformers (DiTs) instead tokenize a spatial latent and process its patches with
transformer blocks. The original DiT experiments replaced the usual U-Net backbone in a latent
diffusion system and found predictable gains as transformer computation increased on the ImageNet
tasks studied.[^dit] Either architecture can use the same high-level corruption objective,
conditioning idea, and family of samplers.

### Discrete diffusion

Gaussian diffusion assumes continuous values. Text tokens, categorical attributes, and graph
structures are discrete, so adding small Gaussian noise to their IDs has no intrinsic semantic
meaning. Discrete denoising diffusion probabilistic models (D3PMs) use categorical transition
matrices instead. A process may replace symbols, move among nearby categories, or turn them into an
absorbing mask token, while the reverse model predicts earlier categorical states.[^d3pm]

Discrete diffusion can revise many positions during one iteration and naturally supports infilling.
Autoregressive decoding instead commits according to a chosen order. The distinction is not
absolute: a discrete corruption process with absorbing masks connects diffusion to masked modeling,
and both diffusion and autoregressive models can use transformers.

## Comparison with other generative methods

No single ranking captures generative models. They differ in training signal, density evaluation,
inference direction, sampling latency, distribution coverage, and support for conditioning. The
following describes standard forms; hybrid systems can combine rows.

| Family                          | What is learned                                   | How a sample is produced                          | Characteristic trade-off                                                              |
| ------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Diffusion or score model        | Reverse transitions, denoising target, or score   | Iterative SDE, ODE, or discrete reverse updates   | Flexible regression training and iterative control, but repeated network evaluations  |
| Generative adversarial network  | Generator opposed by a discriminator              | Usually one generator pass from noise             | Fast sampling without an explicit normalized likelihood; adversarial game in training |
| Variational autoencoder         | Encoder and probabilistic decoder under an ELBO   | Draw a compact latent and decode                  | Amortized inference; quality depends strongly on latent and likelihood choices        |
| Autoregressive model            | Ordered conditional distributions                 | Generate one element or block after another       | Tractable factorization, but sequential decoding along the chosen order               |
| Normalizing flow                | Invertible transformation with tractable Jacobian | Transform a base sample through an invertible map | Exact change-of-variables density, with architectural or integration constraints      |
| Flow matching or rectified flow | Time-dependent velocity field                     | Integrate a deterministic ODE from source to data | Stable regression and potentially direct paths; quality and speed depend on the path  |

### Versus generative adversarial networks

A GAN trains a generator and discriminator in a two-player minimax game. The generator learns to map
noise to data-like samples, while the discriminator learns to separate generated samples from real
ones.[^gan] Once trained, a conventional GAN generator can emit a sample in one forward pass. A
standard diffusion sampler instead reuses a denoiser over several noise levels, making latency its
most visible disadvantage.

Diffusion replaces the adversarial game with regression targets generated from real examples. This
usually avoids balancing two opponents and supplies a target throughout training. Optimization
remains sensitive to architecture, noise weighting, data, and compute. Conversely, GANs do not
inherently define an evaluable normalized density, whereas
probabilistic diffusion admits a variational likelihood bound and continuous-time likelihood
calculation under additional machinery.[^ddpm][^score-sde]

Empirical comparisons are dataset- and metric-specific. Improved DDPM experiments reported greater
recall than selected GAN baselines at similar image-quality scores, and guided diffusion later
surpassed then-leading GAN results on selected ImageNet generation benchmarks.[^improved-ddpm][^guided-diffusion]
A trained GAN may remain preferable when a single low-latency pass matters more than diffusion's
iterative refinement or guidance flexibility.

### Versus variational autoencoders

A VAE learns an encoder `q(z | x)` that approximates a posterior over compact latent variables and a
decoder `p(x | z)`. Its evidence lower bound balances reconstruction likelihood against a divergence
that regularizes the encoded distribution toward a prior.[^vae] Standard VAE inference therefore
provides a learned data-to-latent map, and generation with a feed-forward decoder can require only a
latent draw and a decoder pass.

A DDPM can also be derived as a variational latent-variable model, but it normally uses a fixed
forward corruption distribution and a long hierarchy `x_1 ... x_T` rather than learning a compact
inference encoder for that hierarchy. Its simple denoising loss is applied across noise levels, and
generation traverses the learned hierarchy iteratively. A latent diffusion system combines both
ideas: an autoencoder supplies compression, while diffusion supplies the prior over compressed
codes.[^ddpm][^latent-diffusion]

VAEs are useful when fast encoding, a compact representation, or amortized posterior inference is a
primary requirement. Diffusion is attractive when iterative refinement and flexible conditional
sampling justify more generation compute. Neither label alone determines perceptual quality; decoder
likelihoods, latent capacity, architecture, and evaluation all matter.

### Versus autoregressive models

An autoregressive model factorizes a joint distribution in an order:

```text
p(x) = product_i p(x_i | x_1, ..., x_(i-1))
```

PixelRNN, for example, predicts image pixels sequentially and assigns a discrete probability to raw
pixel values.[^pixelrnn] Modern language models apply the same principle to tokens. Training can
evaluate many next-element predictions in parallel when the full example is known, but ordinary
generation must wait for earlier generated elements.

Diffusion reverses a corruption level rather than a left-to-right or raster order. Within one
denoising evaluation, it can update the whole tensor in parallel; it then repeats that operation over
time. Its sequential depth is thus tied to sampler evaluations rather than directly to the number of
elements. This can be advantageous for large spatial arrays or infilling, while autoregression is a
natural fit for streamed, ordered discrete data and offers a direct normalized factorization.

The latency comparison depends on scale. Autoregressive generation benefits from cached states and
usually performs one new-element computation per step; diffusion revisits all current positions but
may use far fewer steps than there are pixels, audio samples, or tokens. Discrete diffusion and block
autoregression further blur the boundary.

### Versus normalizing flows

A normalizing flow learns an invertible transformation between data and a known base distribution.
The change-of-variables formula provides exact log-density, exact latent inversion, and direct
sampling when the transformation and its Jacobian determinant are tractable.[^realnvp] These demands
constrain conventional flow architectures.

Standard diffusion deliberately destroys information in its stochastic forward process and learns
an approximate reverse; it can use a general-purpose non-invertible denoiser. Its usual discrete
formulation supplies a likelihood bound rather than the simple exact density of an invertible flow.
The boundary is nevertheless porous: a diffusion model's probability-flow ODE is invertible under
ideal integration and can support likelihood computation, although doing so requires solving an ODE
and estimating a divergence term.[^score-sde]

### Versus flow matching and rectified flows

**Flow matching** trains a continuous normalizing flow by regressing a time-dependent velocity field
for a chosen path between a source distribution and data. Sampling integrates a deterministic ODE.
Unlike score-based diffusion, the network need not estimate the gradient of a noisy density, and the
path need not arise from progressive Gaussian corruption.[^flow-matching]

The two families overlap. Flow matching can use diffusion probability paths, while other variants
choose straighter optimal-transport-like paths intended to require easier integration. Both can use
similar U-Net or transformer backbones, similar conditioning mechanisms, and iterative solvers. The
clearest distinction is the learned field and path—score along a stochastic noising process versus
velocity along a probability path—not whether the product is an image generator or a transformer.

**Rectified flow** is a closely related construction that regresses velocities along straight lines
between samples from two endpoint distributions. Its rectification procedure can be repeated to make
the learned trajectories straighter and therefore easier to approximate with coarse time
steps.[^rectified-flow] It is often discussed beside flow matching because both learn deterministic
transport ODEs, although their original objectives and coupling constructions are not identical.

## Applications

Diffusion is useful wherever the desired output is a distribution of plausible high-dimensional
objects rather than one deterministic target. Representative applications include:

- unconditional, class-conditional, and text-conditional image generation;
- inpainting, uncropping, colorization, restoration, and super-resolution;[^palette]
- waveform generation and neural vocoding;[^diffwave]
- unconditional, predictive, and text-conditioned video generation;[^video-diffusion]
- molecular conformation generation with rotation- and translation-aware networks;[^geodiff]
- time-series imputation conditioned on observed values;[^csdi]
- inverse problems and posterior sampling when observations can guide the reverse process.[^score-sde]

These applications require different representations and inductive biases. A molecular system may
need geometric equivariance; video must preserve temporal as well as spatial coherence; text needs a
discrete or continuous embedding formulation. “Uses diffusion” specifies the generative mechanism,
not a complete system design.

### Case study: removing invisible image watermarks

Image restoration can also act as an attack on a provenance system. An invisible watermark is a
small, structured image perturbation; a generative denoiser can replace that signal with details
favored by its learned image prior even when it was never trained to target the watermark. Earlier
research formalized and tested this family of **regeneration attacks** by adding noise and
reconstructing an image with pretrained generative models.[^watermark-regeneration]

The 2025 return moe experiment
[Watermark Removal as a Denoising Task](/watermark-removal-as-a-denoising-task/) tested an
especially small version of the transformation. It encoded a watermarked anime frame through
WAI-Illustrious-SDXL v15 and ran one late reverse update with new noise disabled; a second pass was
also tested for Watermark Anything. The available decoders no longer recovered the TrustMark or
SynthID signals after one pass, while WAM payload accuracy fell from `1.00` to `0.56` after one pass
and to the unwatermarked control's `0.53` after two.[^return-moe-watermark]

This is not full forward diffusion followed by generation from heavy noise. It is a minimal
image-to-image projection through an anime-specialized SDXL prior. The output retained the main scene
but altered fine interface details, showing the central trade-off: defeating a low-level detector by
generative reconstruction may preserve semantic appearance without preserving the exact image. The
single-image result is a robustness case study, not a universal removal rate.

## Strengths

Diffusion models have several recurring advantages:

- The core denoising objective is a direct regression problem with targets produced from data, not a
  learned adversary.[^ddpm]
- Noise smoothing lets one network learn a sequence of distributions from a simple prior to complex
  data, while the architecture itself need not be invertible.[^score-model]
- Conditioning and guidance can be applied repeatedly during generation, enabling a controllable
  trade-off between conditional adherence and diversity.[^guided-diffusion][^cfg]
- Iterative generation naturally accommodates partial observations and repeated corrections, which
  is useful for editing and inverse problems.[^palette][^score-sde]
- The framework extends across continuous, discrete, spatial, temporal, and geometric domains rather
  than belonging only to image synthesis.[^d3pm][^diffwave][^video-diffusion][^geodiff]

These are tendencies, not guarantees. A poorly chosen dataset, representation, objective, sampler,
or evaluation can outweigh the advantages of the model family.

## Limitations and risks

**Sampling cost.** Ordinary generation requires repeated evaluation of a large network. Faster
solvers, latent representations, distillation, and consistency training reduce the count or cost of
steps, but may introduce approximation error, a compression bottleneck, extra training, or a changed
quality–diversity trade-off.[^latent-diffusion][^dpm-solver][^consistency-models]

**Training cost and weighting.** Although one random noise level is sufficient per training example,
the model must learn behavior across the entire range. Noise schedule, target parameterization, loss
weighting, preconditioning, and numerical precision materially affect optimization.[^improved-ddpm][^edm]

**Accumulated error.** The sampler repeatedly acts on its own intermediate outputs. Prediction and
discretization errors can accumulate, especially when very few steps are used or guidance pushes the
trajectory away from regions represented during training. More steps cannot repair a systematically
wrong score, condition, or dataset.

**Representation limits.** Latent diffusion inherits information lost by its autoencoder. Discrete
diffusion depends on a corruption process suitable for its vocabulary or structure. A denoiser's
architecture still needs the capacity and inductive biases required by the domain.[^latent-diffusion][^d3pm]

**Control is not correctness.** Guidance can make an output look more compatible with a condition
without making it factual, physically valid, unbiased, or safe. A text-conditioned image model is not
a retrieval system, and a molecule generator is not a substitute for experimental validation.

**Data and privacy risks.** Like other large generative models, diffusion systems can reproduce bias,
sensitive content, and copyrighted or private examples present in their data. A 2023 extraction study
recovered memorized training examples from several image diffusion systems under a generate-and-
filter attack, demonstrating that generated output cannot be assumed independent of individual
training records.[^training-data-extraction] The incidence depends on the model, dataset duplication,
prompting, and attack; the result does not mean that every output is a stored training image.

## Common misconceptions

- **“The model learns to undo one exact noising sequence.”** Training samples independent times and
  noises. The network learns a statistical reverse field across the data distribution.
- **“Generation runs the forward process and then reverses it.”** Unconditional generation starts
  from newly drawn terminal noise. The forward process is primarily a training construction.
- **“The denoiser reveals the original image hidden in random noise.”** Fresh noise has no unique
  original. At each level, many clean samples are compatible with a noisy state.
- **“Diffusion is necessarily random at every step.”** Ancestral and SDE samplers are stochastic;
  DDIM and probability-flow ODE sampling can be deterministic for a fixed initial state.[^ddim][^score-sde]
- **“A diffusion model is a U-Net.”** U-Nets and transformers are alternative denoiser backbones.
  Diffusion specifies the corruption and generative process.[^dit]
- **“Latent diffusion and diffusion are the same thing.”** Latent diffusion is one efficiency design;
  data-space and discrete diffusion do not require its autoencoder.[^latent-diffusion][^d3pm]
- **“More denoising steps always improve the result.”** Solver accuracy, model error, stochasticity,
  guidance, and the selected time schedule interact; the best count is system- and budget-specific.

## Choosing between methods

Diffusion is a strong candidate when outputs are high-dimensional and multimodal, conditioning or
editing must remain flexible, distribution coverage matters, and several network evaluations fit the
latency budget. Latent diffusion is especially useful when a high-quality autoencoder can remove
perceptually redundant dimensions without discarding task-critical information.

Another family may be a better starting point when a requirement aligns directly with its structure:

- use a GAN when one-pass generation latency is paramount and adversarial training is acceptable;
- use a VAE when a learned encoder and a compact probabilistic latent representation are central;
- use an autoregressive model when the data has a natural causal order, streaming is required, or a
  direct discrete likelihood factorization is valuable;
- use an invertible normalizing flow when exact transformation and density evaluation justify its
  constraints;
- consider flow matching or rectified flow when deterministic transport along a chosen probability
  path is preferable to learning a diffusion score.

The decision should be made with matched data, model size, conditioning, evaluation, and compute.
Sample quality alone is insufficient: training stability, likelihood or calibration, diversity,
latency, memory, controllability, privacy, and downstream validity may lead to different choices.

## References

[^thermodynamics]: [Deep Unsupervised Learning using Nonequilibrium Thermodynamics](https://proceedings.mlr.press/v37/sohl-dickstein15.html).

[^score-model]: [Generative Modeling by Estimating Gradients of the Data Distribution](https://arxiv.org/abs/1907.05600).

[^ddpm]: [Denoising Diffusion Probabilistic Models](https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html).

[^score-sde]: [Score-Based Generative Modeling through Stochastic Differential Equations](https://openreview.net/forum?id=PxTIG12RRHS).

[^improved-ddpm]: [Improved Denoising Diffusion Probabilistic Models](https://proceedings.mlr.press/v139/nichol21a.html).

[^guided-diffusion]: [Diffusion Models Beat GANs on Image Synthesis](https://proceedings.neurips.cc/paper/2021/hash/49ad23d1ec9fa4bd8d77d02681df5cfa-Abstract.html).

[^ddim]: [Denoising Diffusion Implicit Models](https://arxiv.org/abs/2010.02502).

[^progressive-distillation]: [Progressive Distillation for Fast Sampling of Diffusion Models](https://arxiv.org/abs/2202.00512).

[^cfg]: [Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598).

[^latent-diffusion]: [High-Resolution Image Synthesis with Latent Diffusion Models](https://openaccess.thecvf.com/content/CVPR2022/html/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.html).

[^edm]: [Elucidating the Design Space of Diffusion-Based Generative Models](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a98846e9d9cc01cfb87eb694d946ce6b-Abstract-Conference.html).

[^dpm-solver]: [DPM-Solver: A Fast ODE Solver for Diffusion Probabilistic Model Sampling in Around 10 Steps](https://proceedings.neurips.cc/paper_files/paper/2022/hash/260a14acce2a89dad36adc8eefe7c59e-Abstract-Conference.html).

[^consistency-models]: [Consistency Models](https://proceedings.mlr.press/v202/song23a.html).

[^dit]: [Scalable Diffusion Models with Transformers](https://openaccess.thecvf.com/content/ICCV2023/html/Peebles_Scalable_Diffusion_Models_with_Transformers_ICCV_2023_paper.html).

[^d3pm]: [Structured Denoising Diffusion Models in Discrete State-Spaces](https://proceedings.neurips.cc/paper/2021/hash/958c530554f78bcd8e97125b70e6973d-Abstract.html).

[^gan]: [Generative Adversarial Nets](https://proceedings.neurips.cc/paper_files/paper/2014/hash/f033ed80deb0234979a61f95710dbe25-Abstract.html).

[^vae]: [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114).

[^pixelrnn]: [Pixel Recurrent Neural Networks](https://proceedings.mlr.press/v48/oord16.html).

[^realnvp]: [Density Estimation using Real NVP](https://openreview.net/forum?id=HkpbnH9lx).

[^flow-matching]: [Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747).

[^rectified-flow]: [Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow](https://arxiv.org/abs/2209.03003).

[^palette]: [Palette: Image-to-Image Diffusion Models](https://arxiv.org/abs/2111.05826).

[^sdedit]: [SDEdit: Guided Image Synthesis and Editing with Stochastic Differential Equations](https://arxiv.org/abs/2108.01073).

[^diffwave]: [DiffWave: A Versatile Diffusion Model for Audio Synthesis](https://arxiv.org/abs/2009.09761).

[^video-diffusion]: [Video Diffusion Models](https://arxiv.org/abs/2204.03458).

[^geodiff]: [GeoDiff: A Geometric Diffusion Model for Molecular Conformation Generation](https://arxiv.org/abs/2203.02923).

[^csdi]: [CSDI: Conditional Score-based Diffusion Models for Probabilistic Time Series Imputation](https://arxiv.org/abs/2107.03502).

[^training-data-extraction]: [Extracting Training Data from Diffusion Models](https://www.usenix.org/conference/usenixsecurity23/presentation/carlini).

[^watermark-regeneration]: [Invisible Image Watermarks Are Provably Removable Using Generative AI](https://arxiv.org/abs/2306.01953).

[^return-moe-watermark]: [Watermark removal as a denoising task](https://blog.return.moe/en/2025/12/21/watermark-removal-as-a-denoising-task/), return moe blog, 21 December 2025.
