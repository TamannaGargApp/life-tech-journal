"""Seed content that should always exist on the site.

Runs on startup and only inserts articles whose slug is missing, so edits made
later through the CMS are never overwritten.
"""
import re, math
from datetime import datetime
from app.models.article import Article, ArticleStatus
from app.models.user import User, UserRole


AI_ARTICLE_SLUG = "how-ai-is-reshaping-the-world-and-peoples-lives"

AI_ARTICLE_CONTENT = """
<p>A few years ago, artificial intelligence was something most people met only in films and research papers. Today it sits quietly inside the apps we open every morning: it finishes our sentences, sorts our inbox, recommends what we watch, flags suspicious payments on our cards and translates a menu in a foreign city with a single photo. AI has stopped being a future technology. It is now part of the fabric of everyday life, and it is changing both how the world works and how individual people live.</p>

<p>This article steps back from the hype to look at where that change is actually happening, what it means for ordinary people, and how to make the most of it without losing sight of the risks.</p>

<h2>From Research Labs to Everyday Tools</h2>

<p>The turning point came when AI systems became useful to people who are not engineers. Large language models made it possible to ask a question in plain words and get a helpful answer back. Image and speech models made it possible to describe a picture, transcribe a meeting or talk to a phone as naturally as to a friend. Once AI could understand ordinary language, it could be built into almost any product.</p>

<p>The result is that AI now reaches billions of people, often without them noticing. When a navigation app reroutes you around traffic, when a bank blocks a fraudulent transaction, or when your email filters out spam, a machine learning model is making that decision in the background.</p>

<h2>How AI Is Reshaping Work</h2>

<p>Work is where the change is most visible. AI is taking over many repetitive tasks that used to fill people's days: drafting routine emails, summarising long documents, writing first versions of reports, generating code, and answering common customer questions. That does not mean people are no longer needed. In most workplaces, it means the shape of a job is changing.</p>

<ul>
  <li><strong>Knowledge workers</strong> use AI assistants to research faster, draft documents and analyse data, which frees time for judgement, strategy and relationships.</li>
  <li><strong>Software developers</strong> write, test and debug code alongside AI tools, shipping features in hours that once took days.</li>
  <li><strong>Small businesses</strong> can now afford marketing copy, customer support and bookkeeping help that used to require a dedicated team.</li>
  <li><strong>Creative professionals</strong> use AI to explore ideas quickly, generate mood boards and handle tedious editing, while keeping the final creative decisions for themselves.</li>
</ul>

<p>Some roles will shrink, and new ones are already appearing: people who design AI workflows, check AI output for accuracy, and train systems on specialist knowledge. The most valuable skill in this new environment is not competing with AI but knowing how to work with it well.</p>

<h2>Healthcare: Earlier Answers, Better Care</h2>

<p>Few areas show AI's potential as clearly as healthcare. Models trained on medical images can help doctors spot signs of disease in scans and screenings, sometimes earlier than the human eye alone. AI is speeding up drug discovery by predicting how molecules will behave, a process that used to take years of trial and error. In hospitals, AI tools transcribe consultations and handle paperwork, giving doctors and nurses more time with patients.</p>

<p>For individuals, wearable devices and health apps use AI to track sleep, heart rhythm and activity, nudging people towards healthier habits and alerting them when something looks unusual. The goal is not to replace doctors but to give them, and their patients, better information sooner.</p>

<h2>Education That Adapts to Every Learner</h2>

<p>Classrooms have always struggled with one basic problem: every student learns at a different pace. AI tutors can explain a concept in several ways, offer extra practice exactly where a student is stuck, and stay patient at midnight before an exam. Language learners can hold real conversations with an AI partner. Teachers can use AI to prepare lessons, create quizzes and give faster feedback, leaving more time for the human side of teaching.</p>

<p>The same tools are opening up learning for adults. Anyone with a phone can now ask an AI to explain a tax form, teach them basic programming or summarise a difficult book. Access to a patient, knowledgeable helper is no longer limited to people who can afford private tuition.</p>

<h2>Changing Daily Life at Home</h2>

<p>Beyond work and school, AI is reshaping the small routines of daily life:</p>

<ul>
  <li><strong>Communication:</strong> real-time translation and transcription help people talk across languages and make content accessible to people who are deaf or hard of hearing.</li>
  <li><strong>Accessibility:</strong> AI can describe images and surroundings aloud for people with visual impairments, giving them more independence.</li>
  <li><strong>Personal finance:</strong> apps categorise spending, predict upcoming bills and warn about unusual activity.</li>
  <li><strong>Smart homes:</strong> thermostats, lights and assistants learn household routines and cut energy waste.</li>
  <li><strong>Entertainment:</strong> recommendations help people discover music, films and books they would never have found on their own.</li>
</ul>

<h2>The Bigger Picture: Science, Climate and Society</h2>

<p>On a global scale, AI is becoming a tool for some of humanity's hardest problems. Scientists use it to predict protein structures, design new materials and model the climate in finer detail. Energy companies use it to balance power grids and fit more renewable energy into them. Farmers use AI-driven sensors and satellite images to water and fertilise crops more precisely, producing more food with fewer resources. Disaster response teams use it to forecast floods and map damage after earthquakes.</p>

<h2>The Challenges We Cannot Ignore</h2>

<p>A technology this powerful brings real risks, and being honest about them is part of using AI well.</p>

<ul>
  <li><strong>Jobs and skills:</strong> some workers will see their tasks automated faster than they can retrain. Societies will need to invest in education and support for people moving between careers.</li>
  <li><strong>Bias and fairness:</strong> AI learns from data, and data reflects human bias. Systems used in hiring, lending or policing must be tested carefully so they do not repeat unfair patterns.</li>
  <li><strong>Privacy:</strong> AI often depends on personal data. People deserve to know what is collected about them and how it is used.</li>
  <li><strong>Misinformation:</strong> realistic fake images, audio and text are now easy to produce, making it harder to know what is true online.</li>
  <li><strong>Over-reliance:</strong> AI can sound confident while being wrong. Important decisions still need human judgement and verification.</li>
</ul>

<blockquote>AI is a powerful tool, not a replacement for human judgement. The question is not whether it will change our lives, but whether we will shape that change thoughtfully.</blockquote>

<h2>How to Thrive in an AI-Shaped World</h2>

<p>You do not need to be a technologist to benefit from AI. A few simple habits go a long way:</p>

<ol>
  <li><strong>Experiment with everyday tools.</strong> Try an AI assistant for a task you already do, such as planning a trip, drafting an email or summarising an article.</li>
  <li><strong>Stay curious and keep learning.</strong> Skills like critical thinking, communication and creativity become more valuable, not less, when machines handle routine work.</li>
  <li><strong>Verify what matters.</strong> Treat AI answers as a helpful first draft, and double-check facts before acting on them.</li>
  <li><strong>Protect your data.</strong> Read privacy settings and think before sharing personal or sensitive information with any app.</li>
  <li><strong>Use AI to amplify, not replace, yourself.</strong> Let it handle the repetitive parts so you can spend more time on the work and people that matter to you.</li>
</ol>

<h2>Looking Ahead</h2>

<p>AI is reshaping the world in ways both visible and invisible: in hospitals and classrooms, in offices and homes, in laboratories and on farms. Its greatest promise is not machines that think for us, but tools that help each of us learn faster, work smarter, stay healthier and reach further than we could alone.</p>

<p>The future of AI will not be decided by technology alone. It will be shaped by the choices people make about how to build it, regulate it and use it. If we approach it with curiosity, responsibility and a focus on human wellbeing, AI can become one of the most positive forces in the story of how we live.</p>
""".strip()


def _read_time(content: str) -> int:
    text = re.sub(r"<[^>]+>", " ", content)
    return max(1, math.ceil(len(re.findall(r"\w+", text)) / 200))


async def seed_articles() -> None:
    if await Article.find_one(Article.slug == AI_ARTICLE_SLUG):
        return
    admin = await User.find_one(User.role == UserRole.admin)
    now = datetime.utcnow()
    await Article(
        title="How AI is reshaping the world and people's lives",
        slug=AI_ARTICLE_SLUG,
        excerpt="From work and healthcare to education and daily routines, a clear look at how artificial intelligence is changing the world, and how to thrive alongside it.",
        content=AI_ARTICLE_CONTENT,
        category_id="ai",
        author_id=str(admin.id) if admin else "life-tech-team",
        status=ArticleStatus.published,
        published_at=now,
        read_time=_read_time(AI_ARTICLE_CONTENT),
        featured=True,
        editors_pick=True,
        meta_title="How AI is reshaping the world and people's lives",
        meta_description="How artificial intelligence is changing work, healthcare, education and everyday life, the challenges it brings, and how to thrive in an AI-shaped world.",
        keywords=["artificial intelligence", "AI", "future of work", "AI in healthcare", "AI in education", "technology trends"],
    ).insert()
