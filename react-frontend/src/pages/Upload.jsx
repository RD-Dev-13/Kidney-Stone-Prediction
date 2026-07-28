import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload as UploadIcon, Image, Download, Eye, AlertTriangle, CheckCircle } from 'lucide-react'

const Upload = () => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)


  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage({
          file,
          preview: reader.result,
          name: file.name,
          size: file.size
        })
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  })

  const analyzeImage = async () => {
    setAnalyzing(true)
    
    try {
      // Convert image to base64 for Gradio API
      const base64Image = uploadedImage.preview.split(',')[1]

      const response = await fetch('https://nubruuuu-kidney-stone-backend.hf.space/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{ data: base64Image, mime_type: uploadedImage.file.type }]
        })
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const data = await response.json()
      // Gradio returns results in data[0], data[1], etc.
      const prediction = data.data[0]
      const confidence = data.data[1]

      setResult({
        prediction,
        confidence,
        heatmap: uploadedImage.preview
      })
    } catch (error) {
      console.error('Error analyzing image:', error)
      alert('Error analyzing image. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const downloadReport = () => {
    // Simple HTML report with embedded images
    const htmlReport = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kidney Stone Detection Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #1E88E5; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { color: #1E88E5; font-size: 24px; font-weight: bold; }
          .report-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .results { background: ${result.prediction === 'Stone' ? '#ffebee' : '#e8f5e8'}; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .image-section { text-align: center; margin: 30px 0; }
          .image-section img { max-width: 500px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .confidence-bar { background: #e0e0e0; height: 20px; border-radius: 10px; margin: 10px 0; }
          .confidence-fill { height: 100%; background: ${result.prediction === 'Stone' ? '#E53935' : '#43A047'}; border-radius: 10px; width: ${result.confidence}%; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">KidneyAI Pro</div>
          <h1>Kidney Stone Detection Report</h1>
        </div>
        
        <div class="report-info">
          <h3>Report Information</h3>
          <p><strong>Patient Image:</strong> ${uploadedImage.name}</p>
          <p><strong>File Size:</strong> ${(uploadedImage.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Analysis Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Analysis Time:</strong> ${new Date().toLocaleTimeString()}</p>
          <p><strong>Report ID:</strong> KAP-${Date.now()}</p>
        </div>
        
        <div class="results">
          <h3>Analysis Results</h3>
          <p><strong>Prediction:</strong> ${result.prediction === 'Stone' ? 'KIDNEY STONE DETECTED' : 'NO KIDNEY STONE DETECTED'}</p>
          <p><strong>Confidence Score:</strong> ${result.confidence}%</p>
          <div class="confidence-bar">
            <div class="confidence-fill"></div>
          </div>
          <p><strong>Interpretation:</strong> ${result.prediction === 'Stone' 
            ? 'The AI system has detected features consistent with kidney stones. Recommend immediate medical consultation for proper diagnosis and treatment planning.'
            : 'The AI system has not detected features consistent with kidney stones. Continue regular health monitoring as recommended by your healthcare provider.'}</p>
        </div>
        
        <div class="image-section">
          <h3>Medical Image Analysis</h3>
          <img src="${uploadedImage.preview}" alt="Medical Image" />
          <p>Kidney scan image analyzed by AI system</p>
        </div>
        
        <div class="footer">
          <p><strong>Medical Disclaimer:</strong> This AI analysis is for educational and research purposes only. Always consult qualified medical professionals for proper diagnosis and treatment.</p>
          <p><strong>Generated by:</strong> KidneyAI Pro v1.0</p>
        </div>
      </body>
      </html>
    `
    
    // Create and download HTML report
    const blob = new Blob([htmlReport], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kidney-stone-report-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const CircularProgress = ({ percentage }) => {
    const circumference = 2 * Math.PI * 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ${result?.prediction === 'Stone' ? 'text-danger' : 'text-secondary'}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-text-primary dark:text-white">
            {parseFloat(percentage).toFixed(2)}%
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
          Medical Image Analysis
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Upload kidney ultrasound or CT scan for AI-powered stone detection
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-text-primary dark:text-white mb-4 flex items-center gap-2">
            <UploadIcon size={24} />
            Upload Medical Image
          </h2>

          {!uploadedImage ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border-color hover:border-primary hover:bg-primary/5'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Image size={32} className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-text-primary dark:text-white">
                    {isDragActive ? 'Drop image here' : 'Drag & drop image here'}
                  </p>
                  <p className="text-text-secondary dark:text-gray-400">
                    or click to browse files
                  </p>
                </div>
                <p className="text-sm text-text-secondary dark:text-gray-400">
                  Supports PNG, JPG, JPEG (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={uploadedImage.preview}
                  alt="Uploaded scan"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-2 bg-danger text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <p className="font-medium text-text-primary dark:text-white">
                    {uploadedImage.name}
                  </p>
                  <p className="text-sm text-text-secondary dark:text-gray-400">
                    {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-text-primary dark:text-white mb-4">
            Analysis Results
          </h2>

          {analyzing ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary dark:text-gray-400">
                AI is analyzing your medical image...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className={`p-6 rounded-xl text-center ${
                result.prediction === 'Stone' 
                  ? 'bg-danger/10 border border-danger/20' 
                  : 'bg-secondary/10 border border-secondary/20'
              }`}>
                <div className="flex items-center justify-center mb-4">
                  {result.prediction === 'Stone' ? (
                    <AlertTriangle size={48} className="text-danger" />
                  ) : (
                    <CheckCircle size={48} className="text-secondary" />
                  )}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  result.prediction === 'Stone' ? 'text-danger' : 'text-secondary'
                }`}>
                  {result.prediction === 'Stone' ? 'Kidney Stone Detected' : 'No Kidney Stone Detected'}
                </h3>
                <p className="text-text-secondary dark:text-gray-400">
                  {result.prediction === 'Stone' 
                    ? 'Recommend immediate medical consultation' 
                    : 'Normal kidney structure detected'
                  }
                </p>
              </div>

              <div className="text-center">
                <h4 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
                  Confidence Score
                </h4>
                <CircularProgress percentage={result.confidence} />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    // Generate heatmap
                    const img_bytes = new FormData()
                    img_bytes.append('file', uploadedImage.file)
                    
                    fetch('https://nubruuuu-kidney-stone-backend.hf.space/explain', {
                      method: 'POST',
                      body: img_bytes
                    })
                    .then(res => res.json())
                    .then(data => {
                      if (data.heatmap) {
                        // Show heatmap with detailed explanation
                        const newWindow = window.open('', '_blank')
                        newWindow.document.write(`
                          <!DOCTYPE html>
                          <html>
                          <head>
                            <title>Grad-CAM Heatmap Analysis</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                              .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                              .header { text-align: center; margin-bottom: 30px; }
                              .content { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
                              .image-section img { width: 100%; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                              .info-section { padding: 20px; }
                              .color-guide { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0; }
                              .color-item { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; background: #f8f9fa; }
                              .color-dot { width: 20px; height: 20px; border-radius: 50%; }
                              .red { background: #ff4444; }
                              .yellow { background: #ffdd44; }
                              .green { background: #44ff44; }
                              .blue { background: #4444ff; }
                              .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                            </style>
                          </head>
                          <body>
                            <div class="container">
                              <div class="header">
                                <h1>Grad-CAM Heatmap Analysis</h1>
                                <p>AI Explainability for Kidney Stone Detection</p>
                              </div>
                              
                              <div class="content">
                                <div class="image-section">
                                  <img src="${data.heatmap}" alt="Grad-CAM Heatmap" />
                                  <p style="text-align: center; margin-top: 10px; color: #666;">Grad-CAM Overlay showing AI attention areas</p>
                                </div>
                                
                                <div class="info-section">
                                  <div class="section">
                                    <h3>What is Grad-CAM?</h3>
                                    <p><strong>Gradient-weighted Class Activation Mapping</strong> visualizes which parts of the medical image the AI model focused on when making its prediction.</p>
                                  </div>
                                  
                                  <div class="section">
                                    <h3>Color Interpretation</h3>
                                    <div class="color-guide">
                                      <div class="color-item">
                                        <div class="color-dot red"></div>
                                        <div><strong>Red/Orange:</strong> High attention - potential stone areas</div>
                                      </div>
                                      <div class="color-item">
                                        <div class="color-dot yellow"></div>
                                        <div><strong>Yellow:</strong> Moderate attention - areas of interest</div>
                                      </div>
                                      <div class="color-item">
                                        <div class="color-dot green"></div>
                                        <div><strong>Green:</strong> Some relevance to classification</div>
                                      </div>
                                      <div class="color-item">
                                        <div class="color-dot blue"></div>
                                        <div><strong>Blue:</strong> Low importance for decision</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div class="section">
                                    <h3>Medical Interpretation</h3>
                                    <ul>
                                      <li><strong>Bright/Warm Areas:</strong> Regions where AI detected features consistent with kidney stones</li>
                                      <li><strong>Focus Patterns:</strong> Help validate AI reasoning and identify potential diagnostic areas</li>
                                      <li><strong>Educational Value:</strong> Assists medical professionals in understanding AI decision-making</li>
                                      <li><strong>Quality Check:</strong> Ensures AI is focusing on medically relevant regions</li>
                                    </ul>
                                  </div>
                                  

                                </div>
                              </div>
                            </div>
                          </body>
                          </html>
                        `)
                      }
                    })
                    .catch(err => alert('Failed to generate heatmap'))
                  }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Eye size={20} />
                  View Heatmap
                </button>
                <button 
                  onClick={downloadReport}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Report
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadIcon size={32} className="text-text-secondary dark:text-gray-400" />
              </div>
              <p className="text-text-secondary dark:text-gray-400">
                Upload an image to see analysis results
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Upload