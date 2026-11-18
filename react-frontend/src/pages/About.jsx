import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Shield, Clock, Award, AlertTriangle, Users, Target, Zap, Cpu, Layers, ShieldCheck, Activity } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Cpu,
      title: 'Dual-Model Neural Ensemble',
      description: 'Combines EfficientNet-B0 (compound scaling for edge detection) and ResNet50 (residual bottleneck blocks for parenchymal texture) via soft-voting.'
    },
    {
      icon: Zap,
      title: 'ZeroGPU Accelerated Inference',
      description: 'Deployed on Hugging Face Spaces with dynamic ZeroGPU hardware allocation and WebSocket API tunneling via @gradio/client.'
    },
    {
      icon: Brain,
      title: 'Grad-CAM Explainability',
      description: 'Gradient-weighted Class Activation Mapping calculates feature gradients to highlight acoustic shadowing and calculi attention regions.'
    },
    {
      icon: Award,
      title: '94.7% Validated Accuracy',
      description: 'Trained and validated on over 9,400 clinical ultrasound and CT scan images across normal kidney tissue and confirmed nephrolithiasis.'
    }
  ]

  const stats = [
    { icon: Users, value: '9,400+', label: 'Dataset Scans' },
    { icon: Target, value: '94.7%', label: 'Accuracy Rate' },
    { icon: Zap, value: '1.8s', label: 'Average Inference' },
    { icon: Brain, value: '2 CNNs', label: 'Ensemble Models' }
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-white mb-3">
          About KidneyAI Pro
        </h1>
        <p className="text-base sm:text-lg text-text-secondary dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          An end-to-end deep learning system for automated detection of kidney stones (nephrolithiasis) 
          from renal ultrasound and CT imaging, powered by ensemble convolutional neural networks.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-gradient-to-r from-primary to-blue-600 text-white border-none"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <Icon size={28} className="mx-auto mb-2 opacity-90" />
                <div className="text-2xl sm:text-3xl font-bold mb-0.5">{stat.value}</div>
                <div className="text-blue-100 text-xs sm:text-sm font-medium">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Architecture & Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="card"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                  <Icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary dark:text-white mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Clinical Importance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white mb-4">
          Why Early Detection Matters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-2">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap size={24} />
            </div>
            <h3 className="font-semibold text-text-primary dark:text-white mb-1.5">
              Rapid Clinical Triage
            </h3>
            <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
              Provides near-instant classification to assist emergency room clinicians and sonographers.
            </p>
          </div>
          
          <div className="text-center p-2">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock size={24} />
            </div>
            <h3 className="font-semibold text-text-primary dark:text-white mb-1.5">
              Reduced Diagnostic Delays
            </h3>
            <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
              Eliminates backlog wait times by performing immediate automated secondary reads on scans.
            </p>
          </div>
          
          <div className="text-center p-2">
            <div className="w-12 h-12 bg-danger/10 text-danger rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-semibold text-text-primary dark:text-white mb-1.5">
              Prevent Renal Damage
            </h3>
            <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
              Early diagnosis prevents severe hydronephrosis, acute pyelonephritis, and permanent kidney scarring.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Medical Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
      >
        <div className="flex items-start gap-4">
          <AlertTriangle size={24} className="text-amber-600 dark:text-amber-400 mt-1 shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">
              Clinical &amp; Research Disclaimer
            </h3>
            <div className="space-y-2 text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
              <p>
                <strong>Important:</strong> This AI system is designed for educational, research, and computer-aided detection (CAD) assistance. It is not a substitute for formal radiologist interpretation, tissue biopsy, or direct physician examination.
              </p>
              <p>
                Always consult with qualified healthcare professionals for medical diagnosis and treatment planning. The accuracy rates are based on experimental validation datasets and may vary across different ultrasound machine manufacturers and acquisition settings.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How It Works - Step-by-Step Architecture Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="card"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white mb-4">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-3">
            <div className="w-12 h-12 bg-primary text-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              1
            </div>
            <h4 className="font-semibold text-text-primary dark:text-white mb-1.5">Image Ingestion</h4>
            <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
              Upload renal ultrasound or CT scan image via web dropzone (PNG, JPG, JPEG).
            </p>
          </div>
          
          <div className="text-center p-3">
            <div className="w-12 h-12 bg-primary text-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              2
            </div>
            <h4 className="font-semibold text-text-primary dark:text-white mb-1.5">Tensor Normalization</h4>
            <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
              Image is preprocessed, converted to RGB, resized to 224×224 pixels, and normalized.
            </p>
          </div>
          
          <div className="text-center p-3">
            <div className="w-12 h-12 bg-primary text-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              3
            </div>
            <h4 className="font-semibold text-text-primary dark:text-white mb-1.5">Dual-Model Inference</h4>
            <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
              EfficientNet-B0 and ResNet50 run concurrently on ZeroGPU with ensemble probability averaging.
            </p>
          </div>
          
          <div className="text-center p-3">
            <div className="w-12 h-12 bg-primary text-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              4
            </div>
            <h4 className="font-semibold text-text-primary dark:text-white mb-1.5">Grad-CAM &amp; Report</h4>
            <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
              Class activation mapping reveals focus areas and generates a downloadable diagnostic report.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default About
