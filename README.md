# 👋 Welcome to Hack for Infinity – Infinity 2K26!

Hey team! 🎉 Welcome to your dedicated repository for the **Infinity 2K26 Hackathon** organized by the **IEEE Computer Society OUCE Student Chapter**.

This is your team's space to build, commit, and submit your project. Organizers have access to this repo and will review your **commit history** to verify the project was built during hackathon hours — so make sure you're committing regularly throughout the day!

> ⏰ **The repository will be locked at 5:30 PM. No pushes will be accepted after that.**

---

## 📅 Quick Schedule

| Time | Activity |
|------|----------|
| 8:30 – 9:00 AM | Reporting & registration |
| 9:00 – 10:00 AM | Opening briefing & kickoff |
| 10:00 AM – 1:00 PM | Development session |
| 1:00 – 2:00 PM | Lunch break & **Round 1 evaluation** |
| 2:00 – 5:30 PM | Development session & final prep |
| 5:30 – 6:00 PM | **Final judging & presentations** |

---

## ✅ Things to Remember

- Commit your code **frequently** throughout the day
- AI tools (ChatGPT, Copilot, etc.) are allowed — but be ready to **explain your code** to the judges
- Pre-built or plagiarised projects will be **disqualified**
- Bring your laptops, chargers, and any hardware you need
- Include a **project document** in this repo (see required sections below)

---

## 📋 Judging Criteria

Projects will be evaluated on:
- 💡 Innovation and originality
- 🛠️ Technical implementation
- 🌍 Practical impact and usefulness
- 🎨 User experience and design
- 🗣️ Clarity of presentation and explanation

---

---

# 📁 Fill This In — Your Project README

> ✏️ *Replace everything below this line with your own project details*

---

## 🏷️ Project Title

EduVoice 

## 👥 Team Members

| Name | GitHub Username |

| Abhinav| Abhinavrao-verma |

| Rohan| prohansingh |

| Arun  | ArunShowry000 |

## ❓ Problem Statement

Many websites today are not accessible to all users. Common problems include poor colour contrast, missing image descriptions, forms without labels, and navigation that cannot be used with a keyboard. Because of these issues, people who rely on assistive technologies cannot properly access information on the web.

Our project focuses on solving this problem by building a website that follows the guidelines of Web Content Accessibility Guidelines 2.1. These guidelines help developers design websites that are usable for everyone, including people with disabilities.

## 🏗️ System Architecture / Design

duVoice is a **single-page, zero-dependency static web application**. There is no backend, no database, and no server — everything runs entirely in the user's browser. This was a deliberate design choice to ensure the platform is:

- **Instantly deployable** on GitHub Pages with no build step
- **Privacy-first** — uploaded files (PDFs, images, videos) never leave the user's device
- **Offline-capable** for core features once the page has loaded

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER (Client)                    │
│                                                          │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────────┐ │
│  │ index.html│   │ style.css│   │     script.js        │ │
│  │ Structure │   │ Styling  │   │  All behaviour &     │ │
│  │ + ARIA   │   │ + A11y   │   │  feature logic       │ │
│  └──────────┘   └──────────┘   └──────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Browser Native APIs                  │   │
│  │  Web Speech API  │  SpeechRecognition  │  File API│   │
│  │  IntersectionObserver  │  Clipboard API           │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              CDN-loaded Libraries                 │   │
│  │  PDF.js  │  Mammoth.js  │  SheetJS  │  Tesseract  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
              │
              ▼ deployed via
     ┌────────────────┐
     │  GitHub Pages  │
     │  (static host) │
     └────────────────┘
```

### Design Principles

| Principle | Implementation |
|---|---|
| **Accessibility First** | Every element has ARIA roles, labels, and live regions before visual design |
| **Progressive Enhancement** | Core content works without JS; features layer on top |
| **Keyboard Parity** | Every mouse interaction has an equivalent keyboard path |
| **Cognitive Load Reduction** | Focus Mode, one-question-at-a-time quiz, simple language throughout |
| **No Server = No Risk** | Files processed locally; nothing uploaded to any server |


## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **Semantic HTML5** | Structural markup with correct heading hierarchy, landmarks, and roles |
| **CSS3** | Responsive layout, animations, high-contrast & dyslexia-friendly modes |
| **Vanilla JavaScript (ES6+)** | All interactivity — no frameworks, no build tools |

### Browser APIs (Built-in, No Install)

| **Web Speech API** (`SpeechSynthesisUtterance`) | Read-aloud for text, documents, image descriptions, and form fields |
| **SpeechRecognition API** | Live lecture captions and voice quiz answers |
| **File API** | Local file reading without server upload |
| **IntersectionObserver** | Auto-guide heading announcements on scroll |
| **Clipboard API** | Copy OCR-extracted text |

## ⭐ Key Features

### 1. 🔊 Tab-Based Voice Navigation
Users can press **Tab** to move through every interactive element on the page one by one. Each element announces itself automatically. Blind and visually impaired users get a full audio guide to the site — no screen reader software needed.

### 2. 🤟 Indian Sign Language (ISL) Panel
A floating ISL widget displays animated hand-sign representations **word-by-word** as text is being read aloud. Works in all contexts:
- Alongside the document Read Aloud player
- For image descriptions
- Alongside live video captions
- Adjustable S / M / L panel sizes

### 3. 📖 Read Aloud with Sentence Highlighting
Every piece of text can be read aloud. In the document viewer, the **currently-spoken sentence is highlighted** and auto-scrolled into view so users can follow along visually and auditorily at the same time.

### 4. 🔍 Image OCR + Text Explanation
Upload any image (photo, slide, screenshot, handwriting) and **Tesseract.js automatically extracts all visible text**. Extracted text can then be read aloud, shown in ISL, or copied — making visual content fully accessible.

### 5. 📄 Document Accessibility (PDF, Word, Excel)
Upload a PDF, .docx, or .xlsx file to:
- Extract and display the full text in a readable viewer
- Read it aloud with sentence-level highlighting and ISL
- Switch to dyslexia-friendly Lexend font
- Enable high-contrast mode
- Download the extracted text as a plain `.txt` file

### 6. 🎬 Accessible Video Player
Upload a lecture video to access:
- **Live microphone captions** (real-time speech-to-text)
- **ISL panel** alongside captions
- **Reading line highlight** overlay
- **Speed control**: 0.5× / 0.75× / 1× / 1.25× / 1.5×
- **Section repeat**: mark start + end → loop any clip
- Adjustable caption font size (S / M / L)

### 7. ✅ Accessible Quiz System
- Answer by **voice** ("Say A, B, C, or D"), **keyboard**, or mouse click
- One question shown at a time to reduce cognitive overload
- **Read question aloud** button on each question
- Instant accessible feedback per answer with explanation
- Progress bar with screen reader announcements
- Full score + motivational message at the end

### 8. 🔤 Dyslexia-Friendly Font Toggle
One click switches the entire site and all uploaded documents to **Lexend** — a typeface proven to reduce visual stress for dyslexic readers. Letter spacing and line height are also adjusted.

### 9. 🎯 Focus Mode
Hides decorative elements, animations, and visual noise. Increases line spacing and letter spacing. Designed for users with ADHD, cognitive disabilities, or anyone who needs a calmer reading environment.

### 10. 💬 Accessibility Feedback Widget
A persistent floating button lets users report issues with:
- Audio not clear
- Contrast too low
- Text too small
- Hard to navigate by keyboard
- Page is confusing
- ISL not working
## ⚙️ How It Works

## Read Aloud + ISL Pipeline

```
User clicks "Read Aloud"
        │
        ▼
Text split into sentences (regex)
        │
        ▼
SpeechSynthesisUtterance created per sentence
        │
        ├──► Current sentence span gets .sentence-highlight class
        │     (yellow background, auto-scrolled into view)
        │
        └──► If ISL enabled:
              words extracted from sentence
              each word looked up in ISL_WORDS dictionary
              ├─ Known word → show word-sign emoji (e.g. "hello" → 👋)
              └─ Unknown word → fingerspell letter-by-letter
              Each sign displayed for 400–900ms depending on word length
```

### OCR Pipeline

```
User uploads image
        │
        ▼
FileReader creates object URL
        │
        ▼
Tesseract.recognize(imageURL, 'eng')
        │
        ▼
Progress announced via srAnnounce() live region
        │
        ▼
Extracted text displayed in OCR panel
        │
        ├──► Read Aloud button → SpeechSynthesisUtterance
        ├──► ISL button → showISLForText(extractedText)
        └──► Copy button → navigator.clipboard.writeText()
```

### Live Caption + ISL Pipeline (Video)

```
User clicks "Live Captions"
        │
        ▼
SpeechRecognition API starts (continuous, interimResults: true)
        │
        ▼
Interim results → shown in caption panel immediately (greyed)
        │
        ▼
Final results → shown in caption panel + pushed to captionLog[]
        │
        └──► If ISL enabled:
              First word of final result → looked up in ISL dictionary
              Sign displayed in sidebar ISL panel
```

### Voice Quiz Answer

```
User presses "Voice Answer"
        │
        ▼
SpeechRecognition starts (single result, maxAlternatives: 3)
        │
        ▼
Spoken text matched against /\b([ABCD])\b/ regex
        │
        ├─ Match found → radio button for that letter checked
        │                 "Selected option X" spoken aloud
        └─ No match → user prompted to try again
```

### Feedback Auto-Fix

```
User submits feedback
        │
        ├─ "contrast" checked → body.classList.add('high-contrast')
        ├─ "text" checked → textIdx++ → applyTextSize()
        └─ All issues → spoken confirmation via speakText()

**## 🚀 How to Run**

## Option 1 — Open directly in browser (simplest)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/eduvoice.git

# Navigate into the folder
cd eduvoice

# Open index.html in Chrome or Edge
# (double-click the file, or drag it into your browser)
```

> ⚠️ **Use Chrome or Edge** for full feature support. Firefox does not support the SpeechRecognition API (live captions and voice answers will not work). Safari has partial support.

### Option 2 — Local dev server (recommended for OCR)

Tesseract.js requires files to be served over HTTP rather than the `file://` protocol for full functionality. Use any simple static server:

```bash
# Using Python (pre-installed on most systems)
cd eduvoice
python3 -m http.server 8080
# Open http://localhost:8080

# OR using Node.js / npx
npx serve .
# Open http://localhost:3000

# OR using VS Code
# Install the "Live Server" extension
# Right-click index.html → "Open with Live Server"
```

### Option 3 — GitHub Pages (live deployment)

```bash
# 1. Fork or push this repo to your GitHub account

# 2. Go to Settings → Pages

# 3. Set Source to: Deploy from a branch → main → / (root)

# 4. Your site will be live at:
#    https://YOUR_USERNAME.github.io/eduvoice/
```

### File Structure

```
eduvoice/
├── index.html      # All markup, ARIA, and structure
├── style.css       # All styling including accessibility modes
├── script.js       # All interactivity and feature logic
└── README.md       # This file
```

### Browser Permissions Required

| Feature | Permission Needed |
|---|---|
| Live Captions | Microphone (`getUserMedia`) |
| Voice Quiz Answers | Microphone (`getUserMedia`) |
| Read Aloud / ISL | None (uses browser speech synthesis) |
| OCR | None (Tesseract runs locally) |
| File Upload | None (uses File API) |

### Accessibility Testing

```bash
# Run Lighthouse audit
# Chrome DevTools → Lighthouse tab → Accessibility → Analyze

# Run WAVE audit
# Visit https://wave.webaim.org and enter your GitHub Pages URL

# Manual keyboard test checklist:
# ✓ Tab through entire page without using mouse
# ✓ All interactive elements reachable and announce correctly
# ✓ Escape closes modals and menus
# ✓ Arrow keys navigate tabs and star rating
# ✓ Enter/Space activates quiz options
```

---

## 👥 Built for the Community

EduVoice was built for students who are blind or have low vision, students with dyslexia, Deaf students in India who use ISL, students with motor impairments who rely on keyboard navigation, and students with ADHD or cognitive disabilities who benefit from reduced visual complexity.

> *"The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect."*
> — Tim Berners-Lee, Inventor of the World Wide Web
