from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

# Load the trained model
model = tf.keras.models.load_model('model.h5')

# Define the mountain class labels and descriptions
mountain_info = {
    'Bible Rock': "Bible Rock is a prominent rock formation in Sri Lanka, resembling an open book.",
    'Ella Rock': "Ella Rock is a famous hiking destination in Ella, offering breathtaking views of the valley.",
    'Hanthana': "Hanthana Mountain Range is located near Kandy and is popular among trekkers and nature lovers.",
    'Lakegala mountain': "Lakegala is a pyramid-shaped mountain in Sri Lanka, known for its unique shape and folklore.",
    'Mihinthale': "Mihinthale is a historical site in Sri Lanka, considered the birthplace of Buddhism in the country.",
    'Narangala Mountain': "Narangala is a stunning mountain in Badulla District, popular for hiking and sunrise views.",
    'Saptha kanya': "Saptha Kanya, or Seven Virgins Mountain, is a famous mountain range known for its rugged terrain.",
    'Sigiriya': "Sigiriya is an ancient rock fortress and UNESCO World Heritage site, known for its frescoes and history.",
    'SriPada': "Sri Pada (Adam’s Peak) is a sacred mountain in Sri Lanka, revered by multiple religious communities.",
    'Yahangala': "Yahangala is a mountain in Sri Lanka, associated with the legends of King Ravana."
}

@app.route('/predict', methods=['POST'])
def predict():
    print("Received prediction request")  # Debug logging
    
    if 'image' not in request.files:
        print("No image in request")  # Debug logging
        return jsonify({'error': 'No image part in the request'}), 400
    
    img_file = request.files['image']
    
    if img_file.filename == '':
        print("No selected file")  # Debug logging
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        img = Image.open(img_file.stream)
        print("Successfully opened image")  # Debug logging
    except Exception as e:
        print(f"Error processing image: {str(e)}")  # Debug logging
        return jsonify({'error': f'Error processing image: {str(e)}'}), 400
    
    img = img.resize((224, 224))  # Adjust size for model input
    
    if img.mode == 'RGBA':
        img = img.convert('RGB')
    
    img_array = np.array(img) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    
    try:
        predictions = model.predict(img_array)
        max_prob = np.max(predictions)  # Get the highest probability
        predicted_class_idx = np.argmax(predictions, axis=1)[0]

        confidence_threshold = 0.6  # Set confidence threshold (adjust if needed)
        
        if max_prob < confidence_threshold:
            return jsonify({'prediction': 'No mountain detected', 'description': 'The image does not contain a recognized mountain.'})

        predicted_class = list(mountain_info.keys())[predicted_class_idx]
        predicted_description = mountain_info[predicted_class]
        
        print(f"Prediction successful: {predicted_class} with confidence {max_prob:.2f}")  # Debug logging
    except Exception as e:
        print(f"Prediction error: {str(e)}")  # Debug logging
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500
    
    return jsonify({'prediction': predicted_class, 'description': predicted_description})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
