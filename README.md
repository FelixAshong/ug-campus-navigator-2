# UG Campus Navigator

A mobile application built with React Native and Expo to help students navigate the University of Ghana campus easily. The app is particularly useful for freshers and visitors to find their way around the vast campus.

## Features

- 🗺️ Interactive 3D Map with real-time location tracking
- 🔍 Search functionality for all campus locations
- ⭐ Favorite locations for quick access
- 🔔 Push notifications for campus events and emergencies
- 🌙 Dark/Light mode support
- 📱 Offline mode for map and location data
- 🎯 QR code scanning for quick location access
- 🎤 Voice search support
- 🚨 Emergency contacts and quick access to campus security

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Emulator
- Mapbox access token

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ug-campus-navigator.git
cd ug-campus-navigator
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up Mapbox:

   - Create a Mapbox account at [Mapbox](https://www.mapbox.com/)
   - Get your access token
   - Replace `YOUR_MAPBOX_ACCESS_TOKEN` in `src/screens/MapScreen.js` with your actual token

4. Start the development server:

```bash
npm start
# or
yarn start
```

5. Run on your device:

   - Scan the QR code with the Expo Go app (iOS)
   - Scan the QR code with the Expo Go app (Android)
   - Press 'i' to open in iOS simulator
   - Press 'a' to open in Android emulator

## Project Structure

```
ug-campus-navigator/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation configuration
│   ├── context/        # React Context providers
│   ├── constants/      # App constants and data
│   ├── utils/          # Utility functions
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and external services
│   └── assets/         # Images, icons, and other assets
├── App.js              # Main app component
├── app.json            # Expo configuration
└── package.json        # Project dependencies
```

## Technologies Used

- React Native
- Expo
- Mapbox
- React Navigation
- AsyncStorage
- Expo Notifications
- Expo Location

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- University of Ghana for providing the campus map data
- All contributors who have helped in the development of this app
- The React Native and Expo communities for their excellent documentation and support
