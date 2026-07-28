import gradio as gr
from ensemble_backend import app as fastapi_app
import uvicorn

# Create a dummy Gradio interface
demo = gr.Interface(fn=lambda: "Backend is running!", inputs=[], outputs="text")

# Mount the Gradio app onto your existing FastAPI app
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")

# This helps Gradio/Hugging Face detect the app correctly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
