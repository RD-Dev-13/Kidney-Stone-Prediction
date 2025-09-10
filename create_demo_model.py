import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D
import numpy as np

# Create a simple demo model for testing
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Create dummy training data
X_train = np.random.random((100, 224, 224, 3))
y_train = np.random.randint(2, size=(100, 1))

# Train for a few epochs
model.fit(X_train, y_train, epochs=3, verbose=1)

# Save the model
model.save('kidney_stone_model.h5')
print("Demo model created and saved as kidney_stone_model.h5")