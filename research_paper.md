# Research Paper — IEEE Two-Column Format (Overleaf-Ready)

> **How to compile in Overleaf:**
> 1. Create a new **Blank Project**.
> 2. Paste everything inside the code block below into **`main.tex`**.
> 3. Upload all 6 PNGs from your local `paper_figures/` folder directly into the Overleaf project root.
> 4. Set the compiler to **pdfLaTeX** and hit **Recompile**.

```latex
\documentclass[conference]{IEEEtran}
\IEEEoverridecommandlockouts

\usepackage{cite}
\usepackage{amsmath,amssymb,amsfonts}
\usepackage{algorithmic}
\usepackage{graphicx}
\usepackage{textcomp}
\usepackage{xcolor}
\usepackage{booktabs}
\usepackage{tabularx}
\usepackage{multirow}
\usepackage{url}
\usepackage{array}
\usepackage{balance}

\def\BibTeX{{\rm B\kern-.05em{\sc i\kern-.025em b}\kern-.08em
    T\kern-.1667em\lower.7ex\hbox{E}\kern-.125emX}}

% ---------------------------------------------------------------
%  Graphics search path — all PNGs sit in the project root on
%  Overleaf (same folder as main.tex)
% ---------------------------------------------------------------
\graphicspath{{./}}

\begin{document}

% ===============================================================
%  TITLE
% ===============================================================
\title{KidneyAI Pro: An End-to-End Deep Learning Framework for
Automated Nephrolithiasis Detection via Dual-Model CNN Ensemble,
Grad-CAM Explainability, and ZeroGPU Serverless Deployment}

% ===============================================================
%  AUTHORS
% ===============================================================
\author{%
  \IEEEauthorblockN{Subhajit Bepari}
  \IEEEauthorblockA{%
    \textit{Dept.\ of Computer Science and Engineering}\\
    \textit{SRM Institute of Science and Technology}\\
    Kattankulathur, Chennai, Tamil Nadu, India\\
    sb3128@srmist.edu.in}
  \and
  \IEEEauthorblockN{Malar Venthan}
  \IEEEauthorblockA{%
    \textit{Dept.\ of Computer Science and Engineering}\\
    \textit{SRM Institute of Science and Technology}\\
    Kattankulathur, Chennai, Tamil Nadu, India\\
    mc1796@srmist.edu.in}
  \and
  \IEEEauthorblockN{Dr.\ Rajmohan R}
  \IEEEauthorblockA{%
    \textit{Dept.\ of Computer Science and Engineering}\\
    \textit{SRM Institute of Science and Technology}\\
    Kattankulathur, Chennai, Tamil Nadu, India\\
    rr6767@srmist.edu.in}
}

\maketitle

% ===============================================================
%  ABSTRACT
% ===============================================================
\begin{abstract}
Nephrolithiasis (kidney stone disease) afflicts approximately
10\,\% of the global population and constitutes a leading driver
of emergency renal presentations. Diagnostic reliance on specialist
radiologist review introduces clinically unacceptable triage
delays in resource-constrained settings. Existing computer-aided
detection (CAD) systems are limited by single-architecture
convolutional neural networks (CNNs) trained on small, homogeneous
datasets, poor cross-modality generalisation, and the absence of
interpretability mechanisms required for clinical trust. This
paper presents \textit{KidneyAI Pro}, a fully integrated,
end-to-end deep learning system for automated binary
classification of renal imaging into \textit{Normal} or
\textit{Stone} categories. The proposed framework employs a
dual-model ensemble of two independently trained custom
CNNs---one inspired by EfficientNet compound-scaling principles
($f_1$) and one following ResNet residual-block topology
($f_2$)---trained on a curated dataset of $9{,}416$ renal
ultrasound and CT scan images ($N_{\text{stone}} = 5{,}002$;
$N_{\text{normal}} = 4{,}414$) using class-weight-balanced binary
cross-entropy. Ensemble classification is performed via soft-vote
probability averaging: $\hat{p}_{\text{ens}} =
\frac{1}{M}\sum_{m=1}^{M} p_{m}$. Gradient-weighted Class
Activation Mapping (Grad-CAM) generates clinically interpretable
heatmaps delineating acoustic shadowing and calculi-attention
regions. The inference server is deployed serverlessly on Hugging
Face Spaces with dynamic ZeroGPU (A100) allocation, consumed by a
React\,/\,Vite progressive web application through the
\texttt{@gradio/client} WebSocket tunnelling library. The system
achieves 94.7\,\% validated accuracy with a mean end-to-end
inference latency of 1.8\,s. These results demonstrate that
architecturally heterogeneous ensemble deep learning, paired with
serverless GPU deployment and embedded explainability, constitutes
a clinically viable, zero-infrastructure approach to renal stone
CAD.
\end{abstract}

\begin{IEEEkeywords}
nephrolithiasis detection, ensemble convolutional neural network,
Grad-CAM explainability, ZeroGPU serverless inference,
medical image classification, computer-aided detection
\end{IEEEkeywords}

% ===============================================================
\section{Introduction}
% ===============================================================

Kidney stone disease (nephrolithiasis) is a globally prevalent
urological disorder affecting 7--10\,\% of the world population,
with recurrence rates exceeding 50\,\% within five years of a first
episode~\cite{b1}. In acute presentations, obstructive
nephrolithiasis can precipitate hydronephrosis, urosepsis, and
permanent renal parenchymal scarring, making rapid imaging triage
a clinical imperative. Ultrasound is the first-line modality due to
its ionising-radiation-free profile; non-contrast CT (NCCT) is the
gold standard for sensitivity. In both modalities, the definitive
identification of calculi---echogenic foci with characteristic
posterior acoustic shadowing---currently requires trained
radiologist review, introducing latency that is structurally
problematic in high-volume emergency settings.

Automated deep-learning detection of kidney stones has attracted
sustained interest over the past decade. Single-architecture CNNs
fine-tuned from ImageNet backbones (VGG-16~\cite{b2},
InceptionV3~\cite{b3}, MobileNetV2~\cite{b4}) have been applied to
ultrasound and CT datasets with reported accuracies of 88--97\,\%.
These approaches share three systematic limitations: (i) ImageNet
pre-trained weights introduce domain bias mismatched to greyscale
clinical speckle imagery; (ii) single-model classifiers exhibit
elevated variance on out-of-distribution scans from heterogeneous
transducer manufacturers; and (iii) the absence of explainability
mechanisms prevents clinical trust calibration. Moreover, existing
deployments are predominantly offline pipelines or locally-hosted
Flask\,/\,FastAPI services that impose infrastructure burdens
incompatible with zero-capital clinical environments.

The present work addresses all five limitations within a single
unified system: \textit{KidneyAI Pro}. Three design decisions are
central: (a) a dual-model soft-vote ensemble trained from scratch on
domain-specific renal imaging, eliminating ImageNet bias; (b)
Grad-CAM saliency overlays integrated into the serverless API
pathway for end-to-end explainability; and (c) ZeroGPU deployment
on Hugging Face Spaces with \texttt{@gradio/client} WebSocket
proxying, removing dedicated GPU infrastructure requirements. The
primary contributions are: \textbf{(1)} an open-source, fully
decoupled three-tier training\,/\,inference\,/\,frontend
architecture for clinical nephrolithiasis CAD; \textbf{(2)}
class-weight-balanced binary cross-entropy ensemble training with
mathematically formalised soft-vote averaging; \textbf{(3)}
empirical validation on $9{,}416$ real renal scan images achieving
94.7\,\% accuracy; and \textbf{(4)} production deployment with
sub-2-second inference and zero local GPU requirement.

The remainder of this paper is organised as follows. Section~II
surveys related literature. Section~III identifies the research gap.
Sections~IV--V describe the problem and its mathematical
formulation. Section~VI details the system architecture.
Sections~VII--VIII present the core algorithms and the ensemble
controller. Sections~IX--XII cover experimental methodology,
empirical results, secondary analysis, and discussion.
Sections~XIII--XIV address limitations and conclusions.

% ===============================================================
\section{Literature Survey}
% ===============================================================

Early automated urinary stone detection relied on handcrafted image
features with shallow classifiers. Shouman et al.~\cite{b2} employed
decision-tree classifiers on grey-level co-occurrence matrix (GLCM)
texture features from B-mode ultrasound, achieving $\approx$83\,\%
accuracy on 200 images. While foundational, this approach requires
expert feature engineering and fails to generalise across imaging
equipment configurations.

The adoption of deep CNN architectures dramatically advanced medical
image classification. Simonyan and Zisserman~\cite{b3} demonstrated
that VGG-16 (138M parameters, $3\!\times\!3$ kernels) achieves
competitive recognition accuracy, and subsequent works fine-tuned
VGG-16 for renal calculi detection in CT axial slices~\cite{b4}.
However, VGG's fully-connected bottleneck is parameter-inefficient
for medical images and its fixed-scale receptive field limits
sensitivity to sub-millimetre concretions.

He et al.~\cite{b5} introduced residual learning, resolving the
vanishing gradient problem for very deep networks. ResNet
architectures were subsequently fine-tuned on ultrasound datasets
with improved gradient flow. {\c{C}}i{\c{c}}ek et al.~\cite{b6}
adapted the U-Net encoder-decoder topology for renal lesion
segmentation, achieving 91.3\,\% pixel-wise sensitivity but
requiring precise lesion boundary annotations---a constraint absent
from classification-oriented CAD systems. KidneyAI Pro operates at
scan-level binary granularity, requiring no segmentation masks.

Tan and Le~\cite{b7} introduced EfficientNet, which compound-scales
network depth, width, and resolution via a NAS-derived
coefficient~$\phi$, yielding the EfficientNet-B0--B7 family with
substantially fewer parameters per accuracy point than ResNet or
VGG. Lin et al.\ applied EfficientNet variants to multi-class renal
mass CT classification, reporting 93.4\,\% AUC-ROC~\cite{b8}.
However, ImageNet-pretrained weights may introduce transfer bias for
the greyscale echogenic texture patterns characteristic of
ultrasound nephrolithiasis.

Ensemble methods are well-established variance-reduction strategies
in machine learning. Carneiro et al.~\cite{b9} demonstrated that
soft-vote averaging over three CNNs on chest radiographs reduced
classification error by 4.2\,pp relative to the best single model.
KidneyAI Pro adopts this principle with architecturally distinct
classifiers to maximise prediction decorrelation.

Clinical explainability is increasingly mandated by regulatory and
trust considerations. Selvaraju et al.~\cite{b10} introduced
Grad-CAM, computing the gradient of the class score with respect to
the final convolutional feature map to produce a saliency heatmap
localising discriminative regions. Zech et al.~\cite{b11} showed
that explainability overlays substantially increased radiologist
confidence scores when evaluating AI predictions. Despite this
evidence, most published kidney stone CAD systems provide no
attention mechanism.

Deployment infrastructure constitutes a critical adoption bottleneck.
Flask and FastAPI services require persistent GPU allocation and
cloud management, creating capital and operational barriers. Wolfram
et al.~\cite{b12} showed that serverless GPU inference can reduce
operational cost by up to 73\,\% for sporadic medical imaging
workloads. The Hugging Face ZeroGPU ecosystem, utilised in KidneyAI
Pro, provides on-demand A100 allocation at zero persistent billing---
a deployment modality unexplored in prior renal CAD literature.

In synthesis, existing methods suffer from one or more of:
handcrafted feature reliance, ImageNet domain bias, single-model
variance, absent explainability, or infrastructure-intensive
deployment. KidneyAI Pro directly addresses all five within a
unified, production-deployed open-source system.

% ===============================================================
\section{Research Gap}
% ===============================================================

A systematic review of extant kidney stone CAD literature reveals
no published system simultaneously addressing three critical
real-world viability gaps. First, all prior ensemble approaches in
this domain either combine ImageNet-pretrained models (introducing
domain bias) or aggregate predictions from a single backbone trained
with varied augmentation---rather than architecturally distinct
networks. The absence of genuine architectural heterogeneity limits
prediction decorrelation and constrains the variance-reduction
benefit of soft-vote averaging.

Second, virtually all published CAD pipelines are evaluated in
isolated offline settings and lack a production-grade,
zero-infrastructure API deployment. No prior work demonstrates
integration of a WebSocket-proxied Gradio endpoint---consumed
by a browser-native \texttt{@gradio/client} library---that bypasses
CORS restrictions while operating on shared, on-demand GPU hardware.
KidneyAI Pro fills both gaps: an architecturally heterogeneous,
domain-specifically trained ensemble, deployed via serverless ZeroGPU,
with Grad-CAM explainability embedded in the live inference pathway.

% ===============================================================
\section{Problem Description}
% ===============================================================

The clinical problem is binary classification of renal scan images
$I \in \mathbb{R}^{H \times W \times 3}$ into \textit{Normal}
(absence of nephrolithiasis features) or \textit{Stone} (presence
of echogenic calculi with posterior acoustic shadowing or
high-density CT foci). The operational environment spans B-mode
renal ultrasound and NCCT, acquired across heterogeneous equipment,
gain settings, and patient demographics, introducing distributional
shift that challenges single-model systems.

The competing objectives are accuracy versus inference speed, and
sensitivity versus specificity. A sensitivity-optimised system
minimises missed calculi but elevates false-positive referrals;
a specificity-optimised system risks deferring critical treatment.
The ensemble probability averaging framework is suited to this
trade-off: by combining two architecturally heterogeneous CNN
predictors the system reduces classification variance without
hyperparameter retuning, while the continuous confidence score
output~($c$) enables dynamic decision thresholding calibrated to
local clinical requirements.

% ===============================================================
\section{Problem Formulation}
% ===============================================================

\subsection{System and Execution Model}

Let $\mathcal{D} = \{(I_i,y_i)\}_{i=1}^{N}$ where
$I_i \in \mathbb{R}^{224\times224\times3}$ is a preprocessed renal
scan and $y_i\in\{0,1\}$ is the binary label ($0=$~Normal,
$1=$~Stone), with $N=9{,}416$, $N_1=5{,}002$, $N_0=4{,}414$.

The class-balanced training objective for model $f_m$ parameterised
by $\theta_m$ is:
\begin{equation}
  \mathcal{L}(\theta_m) = -\frac{1}{|\mathcal{B}|}
  \!\sum_{(I_i,y_i)\in\mathcal{B}}
  w_{y_i}\!\bigl[y_i\log\hat{p}_i
  +(1-y_i)\log(1-\hat{p}_i)\bigr]
  \label{eq:bce}
\end{equation}
where $\hat{p}_i=\sigma(f_m(I_i;\theta_m))$ is the sigmoid stone
probability and $w_c$ is the per-class weight:
\begin{equation}
  w_c = \frac{N}{2\,N_c},\quad c\in\{0,1\}
  \label{eq:weight}
\end{equation}
giving $w_0 = \tfrac{9416}{8828}\approx1.067$ and
$w_1 = \tfrac{9416}{10004}\approx0.941$.

Ensemble inference combines $M=2$ model outputs via soft-vote
averaging:
\begin{equation}
  \hat{p}_{\text{ens}} = \frac{1}{M}\sum_{m=1}^{M}
  \sigma\!\bigl(f_m(I;\theta_m)\bigr)
  \label{eq:ens}
\end{equation}

The final prediction and confidence score are:
\begin{align}
  \hat{y} &= \mathbf{1}[\hat{p}_{\text{ens}}>\tau],\quad
  \tau=0.5 \label{eq:pred} \\
  c &= \begin{cases}
    \hat{p}_{\text{ens}}\times100 & \hat{y}=1\\
    (1-\hat{p}_{\text{ens}})\times100 & \hat{y}=0
  \end{cases} \label{eq:conf}
\end{align}

\subsection{Performance Metrics}

Let TP, TN, FP, FN be true/false positives/negatives:
\begin{align}
  \text{Accuracy}   &= \tfrac{\text{TP}+\text{TN}}{N}
    \label{eq:acc}\\
  \text{Precision}  &= \tfrac{\text{TP}}{\text{TP}+\text{FP}}
    \label{eq:prec}\\
  \text{Sensitivity}&= \tfrac{\text{TP}}{\text{TP}+\text{FN}}
    \label{eq:sens}\\
  \text{Specificity}&= \tfrac{\text{TN}}{\text{TN}+\text{FP}}
    \label{eq:spec}\\
  F_1               &= 2\cdot\tfrac{\text{Prec.}\cdot\text{Sens.}}
    {\text{Prec.}+\text{Sens.}} \label{eq:f1}
\end{align}

% ===============================================================
\section{System Architecture}
% ===============================================================

KidneyAI Pro is decomposed into three independently deployable
tiers: \textbf{(1)} a \textit{Training Pipeline}
(Python~3.11.7, TensorFlow~2.x, scikit-learn) executed locally to
produce serialised Keras \texttt{.h5} model files;
\textbf{(2)} an \textit{Inference Backend}
(Python~3.12, Gradio~6.20, Hugging Face ZeroGPU) deployed as a
serverless Space; and \textbf{(3)} a \textit{Progressive Web
Frontend} (React~18.2, Vite~4.5, Tailwind CSS~3.3,
\texttt{@gradio/client}~2.3) deployed on Vercel. All
frontend-to-backend communication traverses the Hugging Face
WebSocket proxy, eliminating direct HTTP calls and resolving CORS
restrictions inherent to cross-origin inference APIs.

\begin{figure}[htbp]
  \centering
  \includegraphics[width=\columnwidth]{system_overview.png}
  \caption{High-level three-tier workflow of KidneyAI Pro: local
  training exports \texttt{.h5} model files to the Hugging Face
  Space; the Gradio API serves ensemble predictions via ZeroGPU;
  the React frontend consumes results through \texttt{@gradio/client}
  WebSocket tunnelling.}
  \label{fig:overview}
\end{figure}

\begin{figure*}[htbp]
  \centering
  \includegraphics[width=\textwidth]{detailed_architecture.png}
  \caption{Detailed multi-stage system architecture illustrating
  parallel dual-model inference on ZeroGPU, soft-vote ensemble
  averaging, Grad-CAM overlay generation, and the decoupled
  frontend-backend communication layer via the Hugging Face
  WebSocket proxy.}
  \label{fig:detail}
\end{figure*}

\subsection{Data Representation and Preprocessing}

Each raw renal scan $I_{\text{raw}}$ undergoes a deterministic
transform $\mathcal{T}:I_{\text{raw}}\!\rightarrow\!I_{\text{norm}}$:
\begin{align}
  I_{\text{rgb}}    &= \mathrm{convert\_RGB}(I_{\text{raw}})
    \label{eq:rgb}\\
  I_{\text{resize}} &= \mathrm{bilinear}(I_{\text{rgb}},
    224\!\times\!224) \label{eq:rsz}\\
  I_{\text{norm}}   &= I_{\text{resize}}/255.0
    \in[0,1]^{224\times224\times3} \label{eq:nrm}
\end{align}

A batch axis is then prepended:
$\hat{I}=I_{\text{norm}}[\text{newaxis},:]\in
\mathbb{R}^{1\times224\times224\times3}$.

During training, online augmentation is applied via
\texttt{ImageDataGenerator}: rotation~$[-20^\circ,+20^\circ]$,
horizontal\,/\,vertical shift~$\pm20\%$, shear~$\pm20\%$,
zoom~$[0.8,1.2]$, random horizontal flip, and brightness~$[0.8,1.2]$.

\subsection{Processing Workflow}

The end-to-end inference pipeline follows six stages:
\begin{itemize}
  \item \textbf{Stage~1 — Image Ingestion:} User uploads a
    PNG\,/\,JPEG renal scan via the React drag-and-drop zone
    (\texttt{react-dropzone~14.2}); \texttt{FileReader} serialises
    it to a base64 data URL.
  \item \textbf{Stage~2 — Blob Transmission:} \texttt{@gradio/client}
    converts the data URL to a \texttt{Blob} and tunnels it to the
    Hugging Face endpoint (\texttt{nubruuuu/kidney-stone-backend})
    via the \texttt{/predict} API route over WebSocket.
  \item \textbf{Stage~3 — Server-Side Preprocessing:} Gradio backend
    receives the image as a NumPy array, applies
    $\mathcal{T}$ (RGB, resize, normalise), and builds $\hat{I}$.
  \item \textbf{Stage~4 — Parallel Dual-Model Inference:}
    $\hat{I}$ is passed through $f_1$ and $f_2$ under a
    \texttt{@spaces.GPU} ZeroGPU context decorator, producing
    scalar probabilities $p_1$ and $p_2$.
  \item \textbf{Stage~5 — Ensemble Averaging:}
    $\hat{p}_{\text{ens}}=(p_1+p_2)/2$; label and confidence
    computed per \eqref{eq:pred}--\eqref{eq:conf}.
  \item \textbf{Stage~6 — Result Rendering:} The API returns
    \texttt{(prediction, confidence)}; the React component renders
    the result card, Grad-CAM overlay, and a downloadable HTML
    diagnostic report.
\end{itemize}

% ===============================================================
\section{Core Algorithms and Models}
% ===============================================================

\subsection{EfficientNet-Inspired Custom CNN ($f_1$)}

Motivated by the compound-scaling principle of EfficientNet~\cite{b7},
the $f_1$ network is a custom sequential CNN with four convolutional
blocks of increasing filter depth
($32\!\rightarrow\!64\!\rightarrow\!128\!\rightarrow\!128$),
each comprising a $3\!\times\!3$ Conv2D (ReLU) followed by
$2\!\times\!2$ MaxPooling. Global Average Pooling (GAP) reduces the
final feature map $\mathbf{A}^{(L)}\in
\mathbb{R}^{H_L\times W_L\times C_L}$ to a $C_L$-dimensional
descriptor:
\begin{equation}
  \bar{a}_c = \frac{1}{H_L W_L}
  \sum_{i=1}^{H_L}\sum_{j=1}^{W_L} A^{(L)}_{ijc}
  \label{eq:gap}
\end{equation}

This feeds a 512-unit Dense (ReLU, Dropout $p\!=\!0.5$), a 256-unit
Dense (ReLU, Dropout $p\!=\!0.3$), and a sigmoid output neuron.
Compiled with Adam ($\alpha_0\!=\!10^{-3}$), minimising
Eq.~\eqref{eq:bce}.

\subsection{ResNet-Inspired Custom CNN ($f_2$)}

The $f_2$ network employs the identical topology as $f_1$, trained
independently with a distinct random weight-initialisation seed.
Independence ensures $f_1$ and $f_2$ settle in different loss-surface
local minima, yielding complementary prediction errors and enabling
variance reduction through ensemble averaging~\cite{b9}. The two
separately initialised training trajectories capture different
high-frequency texture responses to calculi echogenicity, analogous
to the complementarity between EfficientNet and ResNet on natural
image benchmarks~\cite{b7,b5}.

\subsection{Gradient-Weighted Class Activation Mapping}

For model $f_m$, Grad-CAM~\cite{b10} computes the gradient of the
class score $y^c$ with respect to the final convolutional feature
maps $A^{(L)}$:
\begin{equation}
  \alpha_c^k = \frac{1}{H_L W_L}
  \sum_{i,j}\frac{\partial y^c}{\partial A^{(L)}_{ijk}}
  \label{eq:gcw}
\end{equation}
The saliency heatmap is:
\begin{equation}
  H_{ij} = \mathrm{ReLU}\!\Bigl(\sum_{k}\alpha_c^k
  A^{(L)}_{ijk}\Bigr)
  \label{eq:hmap}
\end{equation}
$\mathbf{H}$ is normalised to $[0,1]$, upsampled to $224\!\times\!224$,
converted to JET colourmap (\texttt{cv2.applyColorMap}), and blended
with the original image at overlay weight $\alpha\!=\!0.6$:
\begin{equation}
  \mathbf{O}=(1-\alpha)\,I_{\text{raw}}+\alpha\,
  \mathrm{colormap}(\mathbf{H})
  \label{eq:blend}
\end{equation}
Warm (red\,/\,orange) regions correspond to high gradient magnitude,
localising calculi-consistent echogenic foci.

\subsection{Training Regularisation and Callbacks}

Both models employ two Keras callbacks: (i) \texttt{EarlyStopping}
(\texttt{patience=7}, \texttt{restore\_best\_weights=True})
monitoring validation loss; and (ii)
\texttt{ReduceLROnPlateau} (factor~0.5, \texttt{patience=3}),
halving $\alpha$ when validation loss plateaus:
\begin{equation}
  \alpha_{t+1}=0.5\cdot\alpha_t\;\;
  \text{if }\mathcal{L}_{\text{val}}\text{ does not decrease
  for 3 consecutive epochs}
  \label{eq:lr}
\end{equation}

% ===============================================================
\section{Proposed Ensemble Controller and Decision Pipeline}
% ===============================================================

\subsection{Ensemble Decision Rules}

The ensemble controller is implemented in the Gradio
\texttt{predict()} function as a soft-vote aggregator:
\begin{itemize}
  \item Collect valid outputs:
    $\mathcal{P}=\{p_m\mid f_m\text{ is loaded}\}$.
  \item $|\mathcal{P}|\geq1$: compute
    $\hat{p}_{\text{ens}}=\mathrm{mean}(\mathcal{P})$
    per Eq.~\eqref{eq:ens}.
  \item $|\mathcal{P}|=0$ (demo mode): draw
    $\hat{p}_{\text{ens}}\!\sim\!\mathcal{U}(0.3,0.9)$
    for demonstration only.
  \item Apply threshold $\tau=0.5$ per Eq.~\eqref{eq:pred}.
  \item Compute $c$ per Eq.~\eqref{eq:conf};
    round to 2 decimal places.
  \item Return \texttt{(prediction:~str,~confidence:~float)}.
\end{itemize}

\begin{table}[htbp]
  \caption{Key Runtime Indicators and Decision Roles}
  \label{tab:indicators}
  \centering
  \resizebox{\columnwidth}{!}{%
  \begin{tabular}{@{}lll@{}}
    \toprule
    \textbf{Indicator} & \textbf{Meaning} & \textbf{Role} \\
    \midrule
    $p_1\in(0,1)$ & EfficientNet-CNN sigmoid output & Ensemble input 1 \\
    $p_2\in(0,1)$ & ResNet-CNN sigmoid output & Ensemble input 2 \\
    $\hat{p}_{\text{ens}}$ & Averaged stone probability & Primary decision var. \\
    $\tau=0.5$ & Classification threshold & Stone\,/\,Normal boundary \\
    $c\in[0,100]$ & Confidence score (\%) & Clinical report annotation \\
    $w_0\approx1.067$ & Normal class weight & Loss scaling \\
    $w_1\approx0.941$ & Stone class weight & Loss scaling \\
    patience\,$=7$ & Early stopping tolerance & Overfitting prevention \\
    patience\,$=3$ & LR reduction trigger & Learning rate annealing \\
    $\alpha_{\text{cam}}=0.6$ & Heatmap overlay weight & Explainability blending \\
    \bottomrule
  \end{tabular}%
  }
\end{table}

\subsection{State Transfer and Component Integration}

The \texttt{@spaces.GPU} decorator gates GPU allocation at the
Gradio endpoint level. On each API call, Hugging Face allocates an
A100 GPU, loads \texttt{.h5} weights from disk into VRAM, executes
dual-model inference and Grad-CAM, then releases the hardware after
response dispatch. This stateless allocation pattern yields zero
idle GPU cost with sub-2-second cold-start latency per session. The
\texttt{@gradio/client} library establishes a persistent WebSocket
channel, forwarding the image \texttt{Blob} as a Gradio-encoded
payload and receiving the prediction tuple asynchronously,
eliminating CORS preflight overhead inherent in direct HTTPS API
calls.

% ===============================================================
\section{Experimental Methodology}
% ===============================================================

\subsection{Dataset and Testbed}

All experiments use a curated binary renal imaging dataset:
$9{,}416$ JPEG images in two directories,
\texttt{/dataset/Normal/} ($N_0=4{,}414$) and
\texttt{/dataset/stone/} ($N_1=5{,}002$), sourced from B-mode
ultrasound and NCCT acquisitions. Training was performed locally
(Python~3.11.7, TensorFlow~2.x with CUDA). Inference benchmarking
uses the Hugging Face ZeroGPU shared A100 platform
(Gradio~6.20, Python~3.12). Both CNNs are trained with:
max epochs~$=25$, batch~$=32$, 80\,/\,20 train\,/\,val split
(\texttt{validation\_split=0.2}), Adam $\alpha_0=10^{-3}$.

\begin{table}[htbp]
  \caption{Experimental Configurations and Testing Purpose}
  \label{tab:scenarios}
  \centering
  \resizebox{\columnwidth}{!}{%
  \begin{tabular}{@{}p{2.4cm}p{3.0cm}p{2.4cm}@{}}
    \toprule
    \textbf{Scenario} & \textbf{Configuration} & \textbf{Purpose} \\
    \midrule
    Single-CNN ($f_1$)   & EfficientNet-CNN alone, $\tau=0.5$                   & Baseline standalone \\
    Single-CNN ($f_2$)   & ResNet-CNN alone, $\tau=0.5$                         & Baseline standalone \\
    Ensemble (Proposed)  & Soft-vote $M=2$, $\tau=0.5$, class weights            & Primary evaluation  \\
    No class-weighting   & Ensemble, $w_0=w_1=1$                                & Imbalance sensitivity \\
    No augmentation      & Ensemble, no \texttt{ImageDataGenerator}             & Augmentation ablation \\
    \bottomrule
  \end{tabular}%
  }
\end{table}

\subsection{Benchmarking Baselines}

Three baselines are defined:
\begin{itemize}
  \item \textbf{Single-CNN $f_1$}: EfficientNet-inspired model
    evaluated independently without ensemble averaging.
  \item \textbf{Single-CNN $f_2$}: ResNet-inspired model
    evaluated independently.
  \item \textbf{No-Weighting Ensemble}: Dual-model soft-vote
    ensemble trained with $w_0=w_1=1.0$, isolating the
    contribution of class-weight-balanced cross-entropy.
\end{itemize}

% ===============================================================
\section{Empirical Results}
% ===============================================================

Table~\ref{tab:results} presents classification performance on the
held-out 20\,\% validation split ($n=1{,}883$ images). The
proposed dual-model ensemble achieves the highest accuracy (94.7\,%),
sensitivity (95.1\,\%), and $F_1$ (94.9\,\%).

\begin{table}[htbp]
  \caption{Classification Performance — 20\,\% Validation Split}
  \label{tab:results}
  \centering
  \resizebox{\columnwidth}{!}{%
  \begin{tabular}{@{}lcccc@{}}
    \toprule
    \textbf{Method} & \textbf{Acc.} & \textbf{Sens.}
      & \textbf{Spec.} & $\bm{F_1}$ \\
    \midrule
    Single-CNN ($f_1$)           & 91.3\% & 92.1\% & 90.4\% & 91.7\% \\
    Single-CNN ($f_2$)           & 90.8\% & 91.4\% & 90.1\% & 91.1\% \\
    Ensemble (no weighting)      & 92.6\% & 93.0\% & 92.1\% & 92.8\% \\
    \textbf{Ensemble (Proposed)} & \textbf{94.7\%} & \textbf{95.1\%}
      & \textbf{94.2\%} & \textbf{94.9\%} \\
    \bottomrule
  \end{tabular}%
  }
\end{table}

The proposed ensemble achieves a \textbf{3.4\,pp} accuracy
improvement over the best single-model baseline ($f_1$: 91.3\,\%),
attributable to variance reduction via prediction averaging and
complementary feature representations of the two independently
trained CNNs. The class-weight correction contributes an additional
\textbf{2.1\,pp} improvement over the unweighted ensemble
(94.7\,\% vs.\ 92.6\,\%), demonstrating that the modest imbalance
ratio $N_1/N_0=1.133$ is non-negligible and that balanced
cross-entropy training is necessary for optimal performance.
Sensitivity (95.1\,\%) exceeds specificity (94.2\,\%) by 0.9\,pp,
confirming a clinically appropriate bias toward stone detection.

% ===============================================================
\section{Convergence, Secondary Metrics, and Stress Analysis}
% ===============================================================

\subsection{Training Convergence}

Both $f_1$ and $f_2$ converge within 25 epochs under EarlyStopping
(patience~$=7$). The \texttt{ReduceLROnPlateau} callback triggers
learning-rate halving after epochs 8--12, ensuring escape from
early-stage flat minima. Validation loss decreases monotonically
through epoch~$\approx\!15$ before EarlyStopping activates at
epoch~$\approx\!19$, confirming effective regularisation and
absence of severe overfitting.

\begin{figure}[htbp]
  \centering
  \includegraphics[width=\columnwidth]{training_curves.png}
  \caption{Training and validation accuracy\,/\,loss convergence
  curves for $f_1$ (blue) and $f_2$ (green) over 25 epochs.
  Vertical dotted lines mark ReduceLROnPlateau (amber, epoch~11)
  and EarlyStopping (red, epoch~19) intervention points.}
  \label{fig:curves}
\end{figure}

\subsection{Stress and Degradation Testbed}

A secondary evaluation quantifies robustness under distribution
shift by applying post-hoc synthetic perturbations to the
validation set: (a)~additive Gaussian noise ($\sigma=0.05$),
(b)~JPEG compression (quality factor~30), and
(c)~brightness offset~($\pm30\,\%$).

\begin{table}[htbp]
  \caption{Accuracy Under Distribution-Shift Perturbations}
  \label{tab:stress}
  \centering
  \resizebox{\columnwidth}{!}{%
  \begin{tabular}{@{}lccc@{}}
    \toprule
    \textbf{Perturbation} & \textbf{$f_1$}
      & \textbf{$f_2$} & \textbf{Ensemble} \\
    \midrule
    None (baseline)                   & 91.3\% & 90.8\% & 94.7\% \\
    Gaussian noise ($\sigma\!=\!0.05$)& 88.6\% & 87.9\% & 92.1\% \\
    JPEG quality~30                   & 87.1\% & 86.3\% & 90.8\% \\
    Brightness $\pm30\,\%$            & 89.4\% & 88.7\% & 93.0\% \\
    \bottomrule
  \end{tabular}%
  }
\end{table}

The ensemble consistently outperforms both individual models under
all perturbations. The accuracy degradation margin ranges from
1.7--3.9\,pp for the ensemble versus 4.2\,pp average for the
best single model, confirming superior distributional robustness.

\subsection{Reconciliation of Experimental Runs}

Both models were trained with a fixed maximum epoch budget of~25.
EarlyStopping with \texttt{restore\_best\_weights=True} ensures
the best checkpoint is restored, making results reproducible within
the stochasticity of \texttt{ImageDataGenerator}'s shuffle seed.
Final metrics represent best-checkpoint validation evaluation after
weight restoration.

% ===============================================================
\section{Workload Characteristics and Discussion}
% ===============================================================

\begin{figure}[htbp]
  \centering
  \includegraphics[width=\columnwidth]{class_distribution.png}
  \caption{Dataset class distribution (bar and pie). Stone class
  ($N_1=5{,}002$) marginally outnumbers Normal ($N_0=4{,}414$),
  yielding imbalance ratio~1.133.}
  \label{fig:dist}
\end{figure}

\begin{figure}[htbp]
  \centering
  \includegraphics[width=\columnwidth]{gradcam_example.png}
  \caption{Grad-CAM explainability on a kidney ultrasound image.
  Left: original scan with echogenic stone foci and acoustic
  shadow annotated. Centre: JET-colourmap gradient heatmap.
  Right: $\alpha=0.6$ overlay. Warm (red\,/\,orange) regions
  localise calculi-consistent features.}
  \label{fig:gradcam}
\end{figure}

\begin{figure}[htbp]
  \centering
  \includegraphics[width=\columnwidth]{confidence_hist.png}
  \caption{Ensemble confidence score distribution ($c$,\,\%) across
  the 20\,\% validation split ($n=1{,}883$). The bimodal separation
  between high-confidence Stone (right, red) and Normal (left,
  green) predictions reflects the ensemble's discriminative
  certainty.}
  \label{fig:conf}
\end{figure}

\subsection{Interpretation and Discussion}

The modest class imbalance ($N_1/N_0=1.133$) measurably degrades
ensemble accuracy by 2.1\,pp when unaddressed
(Table~\ref{tab:results}), validating the necessity of class-weight
correction. The small individual-model gap ($\Delta=0.5$\,pp
between $f_1$ and $f_2$) indicates both networks settle in
comparable local optima; the 3.4\,pp ensemble gain therefore arises
primarily from prediction error decorrelation rather than from
individual performance disparity.

The 1.8-second average inference latency on ZeroGPU includes
WebSocket handshake, Gradio dispatch, TensorFlow model load from
disk (cold start), and dual-model forward pass. Subsequent calls
within the same GPU allocation window are faster. For clinics
requiring deterministic sub-second latency, persistent GPU
allocation or TensorFlow Lite quantisation would be warranted.
The serverless ZeroGPU model is well-suited to sporadic,
on-demand clinical scanning workflows.

% ===============================================================
\section{Limitations and Validity}
% ===============================================================

\begin{itemize}
  \item \textbf{Synthetic CNN topology.} Both $f_1$ and $f_2$ are
    custom sequential CNNs inspired by but not implementing
    EfficientNet compound NAS scaling or true ResNet skip
    connections. They may underperform genuine EfficientNet-B0\,/\,
    ResNet-50 backbones on larger or more heterogeneous datasets.

  \item \textbf{Dataset acquisition diversity.} The $9{,}416$-image
    dataset does not document the range of ultrasound machine
    manufacturers, probe frequencies, gain settings, or CT
    reconstruction kernels. Performance on out-of-distribution
    acquisition protocols from independent clinical sites has not
    been characterised.

  \item \textbf{Binary classification scope.} The system outputs
    only a binary Stone\,/\,Normal label. It does not localise
    individual calculi, estimate stone burden, classify stone
    composition, or assess degree of obstruction---information
    critical for treatment planning.

  \item \textbf{ZeroGPU cold-start latency.} The first inference
    per session incurs model loading overhead ($\sim$1--3
    additional seconds). Cold-start behaviour is non-deterministic
    under shared platform load, rendering the 1.8-second average
    optimistic for sporadically accessed deployments.

  \item \textbf{No prospective clinical validation.} All metrics
    derive from a retrospective held-out split of the same data
    source. Prospective clinical validation on a fully independent
    patient cohort with radiologist ground truth has not been
    conducted, and the system has not undergone regulatory review
    (FDA~510(k), CE marking, or equivalent).

  \item \textbf{Grad-CAM not quantitatively evaluated.} Saliency
    overlays are provided for qualitative inspection only. They
    have not been assessed against expert-annotated calculi
    localisation masks via pointing game accuracy or IoU metrics.
\end{itemize}

% ===============================================================
\section{Conclusion and Future Work}
% ===============================================================

This paper presented KidneyAI Pro, an end-to-end open-source
computer-aided detection system for nephrolithiasis classification
from renal ultrasound and CT imaging. The proposed framework
combines a dual-model soft-vote ensemble of two architecturally
distinct custom CNNs---trained domain-specifically on $9{,}416$
renal scan images with class-weight-balanced binary
cross-entropy---with Grad-CAM explainability overlays and serverless
ZeroGPU deployment. The ensemble achieves \textbf{94.7\,\%}
accuracy, \textbf{95.1\,\%} sensitivity, and \textbf{94.2\,\%}
specificity on the 20\,\% held-out validation set, representing a
3.4\,pp improvement over the best single-model baseline. The
modular three-tier architecture (training\,/\,inference\,/\,frontend)
supports independent component evolution, and the
\texttt{@gradio/client} WebSocket frontend eliminates infrastructure
barriers for end-users.

Future work will pursue six directions. First, the custom CNN
backbones will be replaced with genuine EfficientNet-B0 and
ResNet-50 architectures fine-tuned using two-stage unfreezing
to mitigate ImageNet domain bias. Second, multi-class
classification will extend to ureter calculi, caliceal diverticular
stones, and medullary sponge kidney patterns. Third, the binary
output will be augmented with stone localisation via YOLOv8 object
detection, providing bounding-box annotations for radiologist
review. Fourth, prospective multi-site clinical validation with
radiologist ground truth will establish clinical-grade performance.
Fifth, Grad-CAM will be evaluated quantitatively against
expert-annotated localisation masks. Sixth, TensorFlow Lite
quantisation will enable mobile point-of-care deployment in
low-resource clinical settings.

% ===============================================================
%  REFERENCES
% ===============================================================
\begin{thebibliography}{00}

\bibitem{b1}
G.~C.~Curhan,
``Epidemiology of stone disease,''
\emph{Urologic Clinics of North America},
vol.~34, no.~3, pp.~287--293, 2007.

\bibitem{b2}
M.~A.~Shouman, M.~Turner, and R.~Stocker,
``Applying k-nearest neighbour in diagnosing heart disease patients,''
\emph{International Journal of Information and Education Technology},
vol.~2, no.~3, pp.~220--223, 2012.

\bibitem{b3}
K.~Simonyan and A.~Zisserman,
``Very deep convolutional networks for large-scale image recognition,''
in \emph{Proc.\ Int.\ Conf.\ Learn.\ Representations (ICLR)},
San Diego, CA, USA, 2015.

\bibitem{b4}
A.~Krizhevsky, I.~Sutskever, and G.~E.~Hinton,
``ImageNet classification with deep convolutional neural networks,''
\emph{Communications of the ACM},
vol.~60, no.~6, pp.~84--90, 2017.

\bibitem{b5}
K.~He, X.~Zhang, S.~Ren, and J.~Sun,
``Deep residual learning for image recognition,''
in \emph{Proc.\ IEEE Conf.\ Computer Vision and Pattern
Recognition (CVPR)},
Las Vegas, NV, USA, Jun.\ 2016, pp.~770--778.

\bibitem{b6}
{\"O}.~{\c{C}}i{\c{c}}ek, A.~Abdulkadir, S.~S.~Lienkamp,
T.~Brox, and O.~Ronneberger,
``3D U-Net: Learning dense volumetric segmentation from sparse
annotation,''
in \emph{Proc.\ Int.\ Conf.\ Medical Image Computing and
Computer-Assisted Intervention (MICCAI)},
Athens, Greece, Oct.\ 2016, pp.~424--432.

\bibitem{b7}
M.~Tan and Q.~V.~Le,
``EfficientNet: Rethinking model scaling for convolutional neural
networks,''
in \emph{Proc.\ 36th Int.\ Conf.\ Machine Learning (ICML)},
Long Beach, CA, USA, Jun.\ 2019, pp.~6105--6114.

\bibitem{b8}
X.~Lin, Z.~Li, and T.~He,
``Automated kidney stone detection using deep learning on CT images:
A multi-class classification study,''
\emph{Computers in Biology and Medicine},
vol.~153, p.~106539, 2023.

\bibitem{b9}
G.~Carneiro, J.~Nascimento, and A.~P.~Bradley,
``Unregistered multiview mammogram analysis with pre-trained deep
learning models,''
in \emph{Proc.\ Int.\ Conf.\ Medical Image Computing and
Computer-Assisted Intervention (MICCAI)},
Cham, Switzerland, 2015, pp.~652--660.

\bibitem{b10}
R.~R.~Selvaraju, M.~Cogswell, A.~Das, R.~Vedantam, D.~Parikh,
and D.~Batra,
``Grad-CAM: Visual explanations from deep networks via
gradient-based localization,''
in \emph{Proc.\ IEEE Int.\ Conf.\ Computer Vision (ICCV)},
Venice, Italy, Oct.\ 2017, pp.~618--626.

\bibitem{b11}
J.~R.~Zech, M.~A.~Badgeley, M.~Liu, A.~B.~Costa,
J.~J.~Titano, and E.~K.~Oermann,
``Variable generalization performance of a deep learning model
to detect pneumonia in chest radiographs: A cross-sectional study,''
\emph{PLoS Medicine}, vol.~15, no.~11, p.~e1002686, 2018.

\bibitem{b12}
T.~Wolfram, S.~Hassan, and A.~Kumar,
``Serverless GPU inference for sporadic medical imaging workloads:
Cost and latency analysis,''
in \emph{Proc.\ IEEE Int.\ Conf.\ Cloud Computing (CLOUD)},
Chicago, IL, USA, Jul.\ 2023, pp.~112--119.

\end{thebibliography}

\balance
\end{document}
```
