# KidneyAI Pro: An End-to-End Deep Learning Framework for Automated Nephrolithiasis Detection via Dual-Model CNN Ensemble and Grad-CAM Explainability

[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-blue.svg)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://www.tensorflow.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC.svg)](https://tailwindcss.com/)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Spaces-ZeroGPU%20A100-yellow)](https://huggingface.co/spaces/nubruuuu/kidney-stone-backend)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg)](https://kidney-stone-ai.vercel.app/)

An end-to-end computer-aided detection (CAD) platform for automated binary classification of kidney stones (*nephrolithiasis*) from renal B-mode ultrasound and computed tomography (CT) scans. The system unites an architecturally heterogeneous dual-model convolutional neural network (CNN) ensemble with Gradient-weighted Class Activation Mapping (Grad-CAM) explainability, serverless ZeroGPU acceleration on Hugging Face Spaces, and a modern progressive web application.

---

## 🌟 Live Deployments

- **Clinical Web Frontend (Vercel):** [https://kidney-stone-ai.vercel.app/](https://kidney-stone-ai.vercel.app/)
- **Inference API & Model Registry (Hugging Face ZeroGPU):** [https://huggingface.co/spaces/nubruuuu/kidney-stone-backend](https://huggingface.co/spaces/nubruuuu/kidney-stone-backend)

---

## 📄 Academic Research Paper

This repository includes a publication-ready research paper written in standard **IEEE two-column conference format** (`\documentclass[conference]{IEEEtran}`).

- **Paper Title:** *KidneyAI Pro: An End-to-End Deep Learning Framework for Automated Nephrolithiasis Detection via Dual-Model CNN Ensemble, Grad-CAM Explainability, and ZeroGPU Serverless Deployment*
- **Authors:**
  - **Subhajit Bepari** — *Department of Computer Science and Engineering, SRM Institute of Science and Technology, Kattankulathur, Chennai, Tamil Nadu, India* (`sb3128@srmist.edu.in`)
  - **Malar Venthan** — *Department of Computer Science and Engineering, SRM Institute of Science and Technology, Kattankulathur, Chennai, Tamil Nadu, India* (`mc1796@srmist.edu.in`)
  - **Dr. Rajmohan R** — *Department of Computer Science and Engineering, SRM Institute of Science and Technology, Kattankulathur, Chennai, Tamil Nadu, India* (`rr6767@srmist.edu.in`)
- **LaTeX Source File:** [`research_paper.md`](./research_paper.md) *(contains a single, self-contained LaTeX code block ready for Overleaf)*
- **Publication Figures:** [`paper_figures/`](./paper_figures/) *(6 publication-quality figures at up to 300 DPI)*

### Paper Abstract
> Nephrolithiasis (kidney stone disease) afflicts approximately 10% of the global population and constitutes a leading driver of emergency renal presentations. Diagnostic reliance on specialist radiologist review introduces clinically unacceptable triage delays in resource-constrained settings. Existing computer-aided detection (CAD) systems are limited by single-architecture convolutional neural networks trained on small, homogeneous datasets, poor cross-modality generalisation, and the absence of interpretability mechanisms required for clinical trust. This paper presents **KidneyAI Pro**, a fully integrated, end-to-end deep learning system for automated binary classification of renal imaging into *Normal* or *Stone* categories. The proposed framework employs a dual-model ensemble of two independently trained custom CNNs—one inspired by EfficientNet compound-scaling principles ($f_1$) and one following ResNet residual-block topology ($f_2$)—trained on a curated dataset of 9,416 renal ultrasound and CT scan images ($N_{\text{stone}} = 5{,}002$; $N_{\text{normal}} = 4{,}414$) using class-weight-balanced binary cross-entropy. Ensemble classification is performed via soft-vote probability averaging: $\hat{p}_{\text{ens}} = \frac{1}{M}\sum_{m=1}^{M} p_m$. Gradient-weighted Class Activation Mapping (Grad-CAM) generates clinically interpretable heatmaps delineating acoustic shadowing and calculi-attention regions. The inference server is deployed serverlessly on Hugging Face Spaces with dynamic ZeroGPU (NVIDIA A100) allocation, consumed by a React/Vite progressive web application through the `@gradio/client` WebSocket tunnelling library. The system achieves **94.7% validated accuracy** with a mean end-to-end inference latency of **1.8 seconds**.

### How to Compile on Overleaf
1. Create a new **Blank Project** in [Overleaf](https://www.overleaf.com/).
2. Copy the LaTeX code block from [`research_paper.md`](./research_paper.md) and paste it into `main.tex`.
3. Upload all 6 PNG files from [`paper_figures/`](./paper_figures/) to the Overleaf project root.
4. Set the compiler to **pdfLaTeX** and click **Recompile**.

---

## 📊 Empirical Performance & Evaluation

The system was evaluated on a held-out 20% validation split ($n = 1{,}883$ scans) from the 9,416-image clinical dataset:

| Model / Configuration | Accuracy | Sensitivity (Recall) | Specificity | $F_1$-Score | Latency |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Single-CNN ($f_1$, EfficientNet-style)** | 91.3% | 92.1% | 90.4% | 91.7% | ~1.2s |
| **Single-CNN ($f_2$, ResNet-style)** | 90.8% | 91.4% | 90.1% | 91.1% | ~1.2s |
| **Ensemble (Uniform Loss Weighting)** | 92.6% | 93.0% | 92.1% | 92.8% | ~1.8s |
| **KidneyAI Pro Ensemble (Proposed)** | **94.7%** | **95.1%** | **94.2%** | **94.9%** | **1.8s** |

- **Variance Reduction:** Soft-vote ensemble probability averaging delivers a **+3.4 percentage-point gain** over the best standalone model ($f_1$: 91.3% $\rightarrow$ 94.7%).
- **Class-Weight Balancing:** Addressing class imbalance ($N_{\text{stone}}/N_{\text{normal}} = 1.133$) via inverse-frequency loss weights yields an additional **+2.1 percentage-point improvement** (92.6% $\rightarrow$ 94.7%).
- **Clinical Safety Bias:** Sensitivity (95.1%) exceeds specificity (94.2%), appropriately minimising false negatives (missed kidney stones).

---

## 🔬 Mathematical Formulation & Core Algorithms

### 1. Class-Balanced Binary Cross-Entropy Loss
To prevent bias toward the majority stone class, inverse class frequencies are incorporated into the loss function:
$$w_c = \frac{N}{2 \cdot N_c}, \quad w_0 \approx 1.067 \; (\text{Normal}), \quad w_1 \approx 0.941 \; (\text{Stone})$$
$$\mathcal{L}(\theta) = -\frac{1}{|\mathcal{B}|} \sum_{(I_i, y_i) \in \mathcal{B}} w_{y_i} \left[ y_i \log \hat{p}_i + (1 - y_i) \log(1 - \hat{p}_i) \right]$$

### 2. Dual-Model Soft-Vote Ensemble Decision Rule
Predictions from both independently trained models are collected as posterior probabilities and averaged:
$$\hat{p}_{\text{ens}} = \frac{1}{2} \left( p_1(I) + p_2(I) \right)$$
$$\hat{y} = \begin{cases} \text{Stone} & \text{if } \hat{p}_{\text{ens}} > 0.5 \\ \text{Normal} & \text{otherwise} \end{cases}, \qquad c = \begin{cases} \hat{p}_{\text{ens}} \times 100\% & \text{if } \hat{y} = \text{Stone} \\ (1 - \hat{p}_{\text{ens}}) \times 100\% & \text{if } \hat{y} = \text{Normal} \end{cases}$$

### 3. Gradient-Weighted Class Activation Mapping (Grad-CAM)
Explainability maps are computed by taking the gradient of the class score $y^c$ with respect to feature map activations $A^{(L)}$ of the final convolutional layer:
$$\alpha_c^k = \frac{1}{H_L W_L} \sum_{i=1}^{H_L} \sum_{j=1}^{W_L} \frac{\partial y^c}{\partial A^{(L)}_{ijk}}, \qquad H_{ij} = \text{ReLU}\left( \sum_{k} \alpha_c^k A^{(L)}_{ijk} \right)$$
$$\mathbf{O} = (1 - \alpha) \cdot I_{\text{raw}} + \alpha \cdot \text{colormap}_{\text{JET}}(H), \quad \alpha = 0.6$$

---

## 🖼️ Publication Figures

The [`paper_figures/`](./paper_figures/) directory contains the figures used in the IEEE paper:

| Figure | Filename | Description |
|:---:|:---|:---|
| **Fig. 1** | [`system_overview.png`](./paper_figures/system_overview.png) | High-level three-tier architecture (Training $\rightarrow$ ZeroGPU Backend $\rightarrow$ React App) |
| **Fig. 2** | [`detailed_architecture.png`](./paper_figures/detailed_architecture.png) | Multi-stage pipeline: Ingestion, Normalization, Parallel Inference, Ensemble, Grad-CAM |
| **Fig. 3** | [`training_curves.png`](./paper_figures/training_curves.png) | Convergence trajectories showing ReduceLROnPlateau & EarlyStopping interventions |
| **Fig. 4** | [`class_distribution.png`](./paper_figures/class_distribution.png) | Class distribution breakdown (Normal: 4,414 vs. Stone: 5,002 scans) |
| **Fig. 5** | [`gradcam_example.png`](./paper_figures/gradcam_example.png) | 3-panel Grad-CAM visualization localizing echogenic stone foci and acoustic shadowing |
| **Fig. 6** | [`confidence_hist.png`](./paper_figures/confidence_hist.png) | Bimodal confidence score distribution on validation scans |

---

## 📁 Repository Structure

```text
kidney-stone-ai/
├── react-frontend/           # React 18 + Vite Progressive Web Application
│   ├── src/
│   │   ├── components/       # Header, Sidebar (with folded dock & animated burger), etc.
│   │   ├── pages/            # Upload (inference & Grad-CAM), About (pipeline architecture)
│   │   ├── App.jsx           # Application routing & dark mode state
│   │   └── index.css         # Tactile 3D button styling & responsive layout
│   ├── package.json          # Dependencies (@gradio/client, Lucide, Tailwind, etc.)
│   └── vite.config.js        # Vite build configuration
├── kidney-stone-backend/     # Hugging Face Spaces Serverless Backend
│   ├── app.py                # Gradio API with @spaces.GPU ZeroGPU decorator
│   ├── final_efficientnet_model.h5   # Trained EfficientNet-style model (5.1 MB)
│   ├── final_resnet50_model.h5       # Trained ResNet-style model (5.1 MB)
│   ├── requirements.txt      # Backend Python dependencies (TensorFlow, Gradio, etc.)
│   └── README.md             # Spaces configuration metadata
├── training/                 # Offline Model Training Pipeline
│   ├── simple_train.py       # Dual CNN training script with class weights & callbacks
│   └── gradcam.py            # Grad-CAM heatmap extraction module
├── dataset/                  # Clinical Kidney Imaging Dataset (9,416 images)
│   ├── Normal/               # 4,414 healthy renal scan images
│   └── stone/                # 5,002 nephrolithiasis scan images
├── paper_figures/            # High-resolution (300 DPI) publication figures
│   ├── system_overview.png
│   ├── detailed_architecture.png
│   ├── training_curves.png
│   ├── class_distribution.png
│   ├── gradcam_example.png
│   └── confidence_hist.png
├── research_paper.md         # Full IEEE two-column research paper LaTeX source
├── requirements.txt          # Root Python environment requirements
└── README.md                 # Project documentation & paper summary
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** $\ge 18.x$ and **npm**
- **Python** $3.11$ or $3.12$
- **Git** (with Git LFS for large `.h5` model files)

---

### 2. Running the Frontend Locally
```bash
# Navigate to the frontend directory
cd react-frontend

# Install dependencies
npm install

# Start Vite local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The frontend automatically connects to the live Hugging Face ZeroGPU backend via `@gradio/client` WebSocket tunnelling.

---

### 3. Running the Backend Locally
```bash
# Navigate to backend directory
cd kidney-stone-backend

# Install dependencies
pip install -r requirements.txt

# Run Gradio application
python app.py
```
*Note: If local GPU acceleration is unavailable, the backend gracefully falls back to CPU inference or demo mode.*

---

### 4. Training the Models Locally
```bash
# Navigate to training directory
cd training

# Ensure TensorFlow is installed with CUDA (recommended)
pip install tensorflow scikit-learn pillow numpy

# Run the training pipeline
python simple_train.py
```
This trains both $f_1$ and $f_2$ sequentially on `../dataset` with data augmentation, class weighting, `EarlyStopping` (patience = 7), and `ReduceLROnPlateau` (patience = 3), exporting `final_efficientnet_model.h5` and `final_resnet50_model.h5`.

---

## ⚙️ Architecture & Deployment Notes

- **ZeroGPU Serverless Acceleration:** The backend leverages Hugging Face Spaces' ZeroGPU tier using the `@spaces.GPU` decorator. An NVIDIA A100 GPU is dynamically leased per inference request and immediately returned, eliminating persistent cloud GPU idle costs.
- **WebSocket RPC Tunnelling:** Communication between the React frontend and Hugging Face backend uses the official `@gradio/client` WebSocket channel, bypassing standard HTTP CORS preflight checks and connection timeouts.
- **Explainable Diagnostics:** Grad-CAM activation maps are generated server-side and visualized in the UI with a color-coded attention guide (Red/Orange = high attention calculi focus, Blue = background tissue).
- **Clinical Report Generator:** Users can generate and download comprehensive diagnostic reports in HTML format containing scan metadata, prediction verdicts, confidence scores, and embedded Grad-CAM overlays.

---

## 📖 Citation

If you use KidneyAI Pro, its dual-model ensemble methodology, or the provided dataset in your research, please cite our paper:

```bibtex
@inproceedings{bepari2026kidneyai,
  title     = {KidneyAI Pro: An End-to-End Deep Learning Framework for Automated Nephrolithiasis Detection via Dual-Model CNN Ensemble, Grad-CAM Explainability, and ZeroGPU Serverless Deployment},
  author    = {Bepari, Subhajit and Venthan, Malar and Rajmohan, R.},
  booktitle = {Proceedings of the IEEE Conference on Computer-Aided Medical Diagnosis},
  year      = {2026},
  address   = {Kattankulathur, Chennai, India},
  publisher = {IEEE}
}
```

---

## ⚖️ Clinical Disclaimer

*KidneyAI Pro is developed for educational, scientific research, and computer-aided detection (CAD) assistance purposes. It is not an FDA/CE-cleared medical device and should not replace clinical judgement, formal radiological interpretation, or biopsy-confirmed diagnosis by qualified healthcare professionals.*
