# Project Blueprint: Ambient Reassurance App

## Overview

This application is a "vibe-coding" project designed for ambient reassurance. It aims to solve the core problem of adult children wanting to know their elderly parents are "alive and okay" without resorting to constant, intrusive calls, while allowing the elderly parents to maintain their sense of independence.

The solution is a simple, passive, or one-tap daily signal system that provides peace of mind through pattern consistency, escalating to an alert only when a pattern is broken. This is an ambient reassurance tool, not a medical monitoring device.

## Design, Style, and Features

The application is built with a "Bold Definition" design philosophy, ensuring a modern, visually engaging, and highly accessible user experience.

### Core Principles:

*   **Elderly-Friendly UI:** The interface for the parent is designed with maximum simplicity and accessibility. This includes large, easily readable text, high-contrast color schemes, and large, tappable buttons.
*   **Modern & Bold Aesthetics:** The app uses a vibrant color palette, expressive typography, and subtle textures and shadows to create a premium, intuitive feel. Interactive elements "glow" to provide clear feedback.
*   **Mobile-First & Responsive:** The design adapts seamlessly to any screen size, ensuring a consistent experience on mobile phones, tablets, and desktops.
*   **Web Components:** Reusable UI elements are built using Web Components (Custom Elements and Shadow DOM) for encapsulation and maintainability.
*   **Accessibility (A11Y):** All components are built to A11Y standards to be usable by people with a wide range of abilities.

### Key Features:

1.  **Parent View: Daily Check-in**
    *   A prominent, one-tap "I'm Okay Today" button.
    *   **Escalation Button:** A clearly marked "I Need Help" button that immediately updates the child's dashboard and displays a list of emergency contacts.
    *   **Dynamic Checklist:** A user-editable checklist for daily tasks. Parents can **add new tasks** and **delete existing ones**.
    *   **Inspirational Quote:** A randomly generated inspirational quote about learning and independence from a famous person.
    *   Clear visual feedback upon completion.

2.  **Child View: Dashboard**
    *   A clean, at-a-glance dashboard.
    *   Displays the parent's status: "Alive & Okay" (Yes/No), or **"NEEDS ATTENTION"**.
    *   **Emergency Contacts:** When the status is "NEEDS ATTENTION", a list of emergency contacts is displayed. This list includes local Singapore emergency numbers (Police and Ambulance) and a link to find Active Ageing Centres.
    *   Shows if the daily routine is "Normal" or if an "Exception" has occurred.
    *   **Displays the results of the parent's submitted checklist, which dynamically updates based on the parent's changes.**
    *   **Caring Quote:** A randomly generated quote about caring for parents.
    *   Displays exception alerts only when the daily check-in is missed or the escalation button is pressed.

3.  **Backend Logic (Firebase)**
    *   **Routine Pattern Logic:** A backend process will check for the daily check-in. If it's missed, the status is flagged as an "exception."
    *   **Data Storage:** Firestore will be used to store check-in data, timestamps, and task completion.
    *   **Reminder System:** A simple, non-intrusive reminder can be triggered if a check-in is missed.

## Current Plan: Add Local Emergency Numbers

This phase focuses on adding local Singapore emergency numbers to the emergency contact list.

1.  **Update JavaScript (`main.js`):**
    *   Modify the `EmergencyContacts` web component to include clickable `tel:` links for the Singapore Police (999) and Ambulance/Fire (995).

2.  **Update CSS (`style.css`):**
    *   No changes are anticipated, as existing styles should apply.
