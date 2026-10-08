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


YOUTH_ARTICLE_SLUG = "youth-have-the-power-to-change-the-world"

YOUTH_ARTICLE_CONTENT = """
<p><strong>This is not a dream anymore. It is something real that is already beginning to unfold—and it is waiting to grow at full scale.</strong></p>
<p>For years, we have heard leaders, speakers, educators, and visionaries talk about the power of youth.</p>
<p><em>"The youth are the future."</em><br />
<em>"Young people need to be creative."</em><br />
<em>"We need new ideas."</em><br />
<em>"The next generation will shape the world."</em></p>
<p>We hear these words everywhere.</p>
<p>But perhaps the more important question is not <strong>whether youth have the power to change the world.</strong></p>
<p>The real question is:</p>
<p><strong>What are we going to do with that power?</strong></p>
<p>Because having potential and using it are two completely different things.</p>
<hr />
<h2>The World Is Already Changing</h2>
<p>We are living in a time unlike any generation before us.</p>
<p>Technology is evolving at an incredible speed. Artificial intelligence, automation, social media, digital communities, biotechnology, renewable energy, and countless other innovations are changing how we live and work.</p>
<p>And the people growing up in this environment are not simply observers.</p>
<p>They are participants.</p>
<p>Today's youth have something incredibly powerful: <strong>the ability to adapt.</strong></p>
<p>We learn new technologies quickly. We communicate across borders. We discover ideas from different cultures within seconds. We can build communities without being physically present in the same place.</p>
<p>A young person with an idea today can potentially reach thousands—or even millions—of people without having a large organization, enormous resources, or a powerful position.</p>
<p>That changes everything.</p>
<p>Your <strong>ideas</strong>, <strong>enthusiasm</strong>, <strong>creativity</strong>, and <strong>determination</strong> can become the starting point of something much bigger than yourself.</p>
<p>A single idea can become a movement.</p>
<p>A movement can become a community.</p>
<p>And a community can create change.</p>
<hr />
<h2>But Do Youth Really Have the Power?</h2>
<p>I believe they do.</p>
<p>But power does not always look like money, political position, authority, or influence.</p>
<p>There is another kind of power that is often underestimated:</p>
<h3>Soft Power.</h3>
<p>The power to influence people through ideas.</p>
<p>The power to inspire.</p>
<p>The power to create.</p>
<p>The power to educate.</p>
<p>The power to build communities.</p>
<p>The power to make people believe that something better is possible.</p>
<p>You don't necessarily need to control people to influence them.</p>
<p>Sometimes, you simply need to show them a better possibility.</p>
<p>When someone creates something that genuinely improves people's lives, others naturally begin to notice.</p>
<p>When someone stands for an idea consistently, people begin to listen.</p>
<p>When someone works toward the betterment of society, that work itself becomes a form of influence.</p>
<p>That is soft power.</p>
<p>And in today's connected world, soft power can travel incredibly far.</p>
<hr />
<h2>Bigger Power, Bigger Influence</h2>
<p>I once started looking at the idea of <em>power</em> differently.</p>
<p>We often associate power with authority.</p>
<p>But what if we think about it as <strong>capacity</strong>?</p>
<p>The greater your ability to create value, the greater your potential influence.</p>
<p>The more people you can help, the wider your impact can become.</p>
<p>The more effectively you can communicate an idea, the further that idea can travel.</p>
<p>And the more consistently you work toward something meaningful, the stronger your influence becomes.</p>
<p>This does not mean everyone needs to become famous.</p>
<p>It does not mean everyone needs millions of followers.</p>
<p>It simply means:</p>
<p><strong>Use whatever power you already have.</strong></p>
<p>Your knowledge is power.</p>
<p>Your skills are power.</p>
<p>Your creativity is power.</p>
<p>Your technology is power.</p>
<p>Your voice is power.</p>
<p>Your time is power.</p>
<p>And your determination is perhaps one of the most important forms of power you possess.</p>
<hr />
<h2>Everyone Has a Plan. But How Will It Happen?</h2>
<p>Ask young people:</p>
<p><strong>"Do you want to change the world?"</strong></p>
<p>Many will say yes.</p>
<p>Ask:</p>
<p><strong>"Do you have an idea?"</strong></p>
<p>Many will say yes again.</p>
<p>Some may even have a detailed plan.</p>
<p>But then comes the question that changes everything:</p>
<h3>"How is it actually going to happen?"</h3>
<p>This is where dreams meet reality.</p>
<p>It is easy to imagine a better world.</p>
<p>It is easy to talk about innovation.</p>
<p>It is easy to give speeches about creativity.</p>
<p>It is easy to say, <em>"We need young people to build the future."</em></p>
<p>But execution is difficult.</p>
<p>And perhaps this is where we need to focus more.</p>
<p>The world doesn't change because someone had a brilliant idea.</p>
<p><strong>The world changes when someone decides to execute that idea.</strong></p>
<hr />
<h2>The Missing Piece: Execution</h2>
<p>We don't necessarily need more motivational speeches.</p>
<p>We need more people willing to take the first step.</p>
<p>You may have an idea for an educational platform.</p>
<p>Build the first version.</p>
<p>You may want to solve an environmental problem.</p>
<p>Start researching and testing solutions.</p>
<p>You may want to help your local community.</p>
<p>Start with ten people.</p>
<p>You may want to use AI to solve a real-world problem.</p>
<p>Learn the technology and build something.</p>
<p>It doesn't have to begin at full scale.</p>
<p>It just has to begin.</p>
<p>Because execution creates something that imagination alone cannot:</p>
<p><strong>evidence.</strong></p>
<p>Once you build something, you can learn from it.</p>
<p>Once you launch something, you can improve it.</p>
<p>Once you take action, you discover problems you could never have predicted while sitting and planning.</p>
<p>That is how ideas become reality.</p>
<hr />
<h2>Dream With Your Eyes Closed. Build With Them Open.</h2>
<p>There is a question I think everyone should ask themselves at least once:</p>
<h3>When you close your eyes and imagine the future, what kind of world do you see?</h3>
<p>Do you see a world where technology makes people's lives easier?</p>
<p>A world where education is accessible to everyone?</p>
<p>A world where healthcare is more affordable?</p>
<p>A world where people care more about the environment?</p>
<p>A world where opportunities are not limited by geography?</p>
<p>A world where humans and technology work together rather than compete?</p>
<p>Whatever that vision is, don't dismiss it simply because it sounds too ambitious.</p>
<p>Every meaningful change begins with someone imagining that things could be different.</p>
<p>But there is an important difference between <strong>dreaming about a better world</strong> and <strong>building one.</strong></p>
<p>Dreaming gives you direction.</p>
<p>Execution gives you movement.</p>
<hr />
<h2>Determination: The Power to Keep Going</h2>
<p>Having an idea is exciting.</p>
<p>Starting is exciting.</p>
<p>But continuing is where determination is tested.</p>
<p>There will be failures.</p>
<p>People may not understand your idea.</p>
<p>Some people may tell you it won't work.</p>
<p>You may lose motivation.</p>
<p>You may build something that nobody uses.</p>
<p>You may have to start again.</p>
<p>And sometimes you may question whether the effort is worth it.</p>
<p>This is where determination matters.</p>
<p>Determination isn't simply saying:</p>
<p><em>"I will succeed."</em></p>
<p>It is being able to say:</p>
<p><strong>"Even if I fail, I will learn and continue."</strong></p>
<p>The path may change.</p>
<p>The strategy may change.</p>
<p>The technology may change.</p>
<p>Your original idea may even change.</p>
<p>But if the purpose behind it remains meaningful, you keep moving.</p>
<p><strong>Just keep going.</strong></p>
<p>Not blindly.</p>
<p>Not without learning.</p>
<p>But continuously.</p>
<hr />
<h2>Technology Has Given Youth Something Previous Generations Never Had</h2>
<p>Technology has dramatically reduced the distance between an idea and its audience.</p>
<p>You can learn almost anything.</p>
<p>You can collaborate with people across the world.</p>
<p>You can create software from your bedroom.</p>
<p>You can publish your thoughts instantly.</p>
<p>You can build a business without a physical office.</p>
<p>You can use AI to accelerate research, creativity, development, and experimentation.</p>
<p>You can find people who believe in the same idea as you.</p>
<p>The tools are becoming more accessible.</p>
<p>The question is increasingly becoming:</p>
<p><strong>What will we do with them?</strong></p>
<p>Technology itself will not change the world.</p>
<p><strong>People using technology with purpose will.</strong></p>
<p>And that is where youth have an extraordinary opportunity.</p>
<hr />
<h2>You Don't Have to Change the Whole World</h2>
<p>Perhaps the phrase <em>"change the world"</em> sounds too big.</p>
<p>So start smaller.</p>
<p>Change something around you.</p>
<p>Help one person.</p>
<p>Solve one problem.</p>
<p>Teach one skill.</p>
<p>Build one useful product.</p>
<p>Create one community.</p>
<p>Improve one process.</p>
<p>Protect one piece of nature.</p>
<p>Give someone an opportunity.</p>
<p>One meaningful action may seem insignificant.</p>
<p>But imagine thousands—or millions—of young people doing this consistently.</p>
<p>That is when individual actions begin to become collective change.</p>
<hr />
<h2>The Future Is Waiting for Execution</h2>
<p>I don't think the future is something that simply happens to us.</p>
<p>The future is something we participate in creating.</p>
<p>And youth are not merely waiting to inherit the world.</p>
<p><strong>They are already building it.</strong></p>
<p>The technologies being created today, the communities being formed, the ideas being shared, and the problems being solved are already shaping what tomorrow will look like.</p>
<p>This movement has already started.</p>
<p>The question is whether we will participate in it.</p>
<p>So if you have an idea, don't wait for the perfect moment.</p>
<p>If you have a dream, don't wait until you feel completely ready.</p>
<p>If you see a problem, don't assume someone else will solve it.</p>
<p>Start.</p>
<p>Learn.</p>
<p>Build.</p>
<p>Fail.</p>
<p>Improve.</p>
<p>Continue.</p>
<p>Because the world doesn't need another generation that only talks about change.</p>
<p><strong>It needs a generation that executes it.</strong></p>
<hr />
<h2>So, Do Youth Have the Power to Change the World?</h2>
<p>Yes.</p>
<p>But power means very little if it remains unused.</p>
<p>Your ideas can be powerful.</p>
<p>Your creativity can be powerful.</p>
<p>Technology can multiply that power.</p>
<p>Your voice can influence others.</p>
<p>Your enthusiasm can inspire a movement.</p>
<p>But <strong>determination turns possibility into progress.</strong></p>
<p>So dream about the world you want to see.</p>
<p>Then open your eyes.</p>
<p>Look at the world that exists today.</p>
<p>Find the gap between the two.</p>
<p>And start building the bridge.</p>
<p><strong>The future is not waiting for someone else.</strong></p>
<p><strong>It is waiting for us to unfold it.</strong></p>
""".strip()


SEED_ARTICLES = [
    dict(
        title="How AI is reshaping the world and people's lives",
        slug=AI_ARTICLE_SLUG,
        excerpt="From work and healthcare to education and daily routines, a clear look at how artificial intelligence is changing the world, and how to thrive alongside it.",
        content=AI_ARTICLE_CONTENT,
        category_id="ai",
        featured=True,
        editors_pick=True,
        meta_title="How AI is reshaping the world and people's lives",
        meta_description="How artificial intelligence is changing work, healthcare, education and everyday life, the challenges it brings, and how to thrive in an AI-shaped world.",
        keywords=["artificial intelligence", "AI", "future of work", "AI in healthcare", "AI in education", "technology trends"],
    ),
    dict(
        title="Youth Have the Power to Change the World",
        slug=YOUTH_ARTICLE_SLUG,
        excerpt="Youth have ideas, energy and technology on their side. The real question is what we do with that power, and the missing piece is execution.",
        content=YOUTH_ARTICLE_CONTENT,
        category_id="motivation",
        featured=False,
        editors_pick=True,
        meta_title="Youth Have the Power to Change the World",
        meta_description="Young people have ideas, creativity and technology on their side. What turns that power into change is execution and determination.",
        keywords=["youth", "change the world", "motivation", "execution", "determination", "soft power"],
    ),
]


async def seed_articles() -> None:
    admin = await User.find_one(User.role == UserRole.admin)
    for data in SEED_ARTICLES:
        if await Article.find_one(Article.slug == data["slug"]):
            continue
        await Article(
            **data,
            author_id=str(admin.id) if admin else "life-tech-team",
            status=ArticleStatus.published,
            published_at=datetime.utcnow(),
            read_time=_read_time(data["content"]),
        ).insert()
