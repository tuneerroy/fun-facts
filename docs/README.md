# Major Components of Project

## Data Collection (Total: 7 Points)

### 1. Web Scraping (2 Points)

- We can scrape data from trusted sources like **Wikipedia** or **Britannica**.
- Alternatively, explore **API endpoints** or existing **data dumps** for sourcing factual data.

### 2. LLMs (2 Points)

- Utilize **LLMs** (e.g., **OpenAI** or **Anthropic** models) to generate facts or realistic-sounding fiction.
- Explore options for obtaining **free API calls** through the course or project.

### 3. Users (1 Point)

- A dedicated page will allow **user submissions** of facts/fiction.
- Submissions are reviewed by moderators. If accepted, the user gains **points** or possibly a **medal** as a reward.

### 4. Crowdsourcing (2 Points)

- Platforms like **MTurk** can be used to gather a wide range of user-generated facts or fiction.
- This is crucial if the project involves distinguishing between **AI-generated** and **human-generated** fiction.

## Quality Control (Total: 5 Points)

### 1. Crowdsourcing Verification (2 Points)

- Crowdsourcing platforms can help verify the **classification** of initial sets of facts and fiction.

### 2. Moderation (1 Point)

- A team of **moderators** will review all new entries, regardless of their source, to maintain quality.

### 3. Rating System (2 Points)

- **Moderators** and **users** can rank the facts and fiction, influencing their visibility and frequency in the game.

## Game Page (Total: 4 Points)

- The **main gameplay** involves users classifying statements as fact or fiction.
- Users' **rankings** and **reputation** are affected based on their accuracy.
- Bonus points are awarded for correctly identifying the type of fiction (AI-generated or human-generated).

## Accounts (Total: 4 Points)

### 1. Users

- Basic features: **register**, **login/logout**, and access to **account settings**.
- Users can view their **reputation** and earned **rewards**.

### 2. Moderators

- An **admin portal** will be available for moderators to review new facts and fiction submissions.

## Data, Quality Control, and Aggregation

### 1. Data
- We have a list of gpt generated facts in the file gpt_facts.txt in the data folder
- More facts pulled from the internet in the document fun_facts.csv, which is also located in the data folder
- Facts pulled from wikipedia can also be found under the data folder in the document random_wikipedia_facts.csv

### 2. Quality Control and Aggregation
- Our quality control process is in the document called quality_control.py document in src/backend
- Our aggregation code is in the file aggregation.py, also located in src/backend
