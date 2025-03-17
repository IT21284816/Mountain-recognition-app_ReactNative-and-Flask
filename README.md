# 🌄 Mountain Recognition App (React Native & Flask)

🚀 A real-time mountain recognition and information retrieval system for Sri Lankan mountains. The app uses a **React Native** frontend and a **Flask** backend deployed on **Google Cloud** to identify mountains and display relevant details.

![Untitled design (1)](https://github.com/user-attachments/assets/9ae985c9-c2b5-4051-a105-84537e17a47d)


---

## ✨ Features
✅ **Real-time Mountain Recognition** using a trained MobileNetV2 model.  
📷 **Live Camera Feed** for detecting and displaying mountain names.  
🌡️ **Temperature & Humidity Display** in the app.  
📜 **Information Retrieval** for recognized mountains.  

---

## 🛠️ Tech Stack
- 🎨 **Frontend:** React Native
- 🖥️ **Backend:** Flask (Deployed on Google Cloud)
- 🧠 **Model:** MobileNetV2
- 🌍 **Data Sources:** Google, Alamy, Pinterest, iStockPhoto, Unsplash, Facebook, Instagram

---

## 🏔️ Supported Mountains
- 🪨 Bible Rock
- 🏞️ Ella Rock
- 🌳 Hanthana
- ⛰️ Lakegala Mountain
- 🕌 Mihinthale
- 🌄 Narangala Mountain
- 🔺 Saptha Kanya
- 🏰 Sigiriya
- 🛕 SriPada
- 🌊 Yahangala

---

## 🚀 Deployment
The backend is deployed on **Google Cloud** and can be accessed at:  
🔗 **[Flask Backend](https://flask-app-453711.el.r.appspot.com)**

### ☁️ Google Cloud Deployment
- The **Flask backend** is deployed using **Google App Engine**.
- The deployment link: **https://flask-app-453711.el.r.appspot.com**
- The **React Native frontend** is currently running locally but can be deployed using **Firebase Hosting** or **Google Cloud Run**.

---

## ⚡ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/Mountain-recognition-app_ReactNative-and-Flask.git
cd Mountain-recognition-app_ReactNative-and-Flask
```

### 2️⃣ Install Dependencies

#### 🏗️ Frontend (React Native)
```bash
cd frontend
npm install
```

#### 🖥️ Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
```

### 3️⃣ Run the Application

#### 🏃 Start Flask Backend
```bash
cd backend
python app.py
```

#### 📱 Start React Native App
For **Android**:
```bash
cd frontend
npx react-native run-android
```
For **iOS**:
```bash
cd frontend
npx react-native run-ios
```

---

## 🤝 Contributing
We welcome contributions! Feel free to submit a pull request or report issues. 🚀

---

## 📜 License
This project is licensed under the **MIT License**. 📝

