"""Seed content that should always exist on the site.

Runs on startup and inserts articles whose slug is missing. An existing article
is only refreshed when its content is still an earlier seeded version (matched
by hash), so edits made later through the CMS are never overwritten.
"""
import re, math, hashlib
from datetime import datetime
from app.models.article import Article, ArticleStatus
from app.models.user import User, UserRole
from app.core.config import settings
from app.core.security import hash_password, verify_password


AI_ARTICLE_SLUG = "how-ai-is-reshaping-the-world-and-peoples-lives"

AI_ARTICLE_CONTENT = """
<p>A few years ago, artificial intelligence was something most people met only in films and research papers. Today it sits quietly inside the apps we open every morning: it finishes our sentences, sorts our inbox, recommends what we watch, flags suspicious payments on our cards and translates a menu in a foreign city with a single photo. AI has stopped being a future technology. It is now part of the fabric of everyday life, and it is changing both how the world works and how individual people live.</p>

<p>This article steps back from the hype to look at where that change is actually happening, what it means for ordinary people, and how to make the most of it without losing sight of the risks.</p>

<h2>From Research Labs to Everyday Tools</h2>

<p>The turning point came when AI systems became useful to people who are not engineers. Large language models made it possible to ask a question in plain words and get a helpful answer back. Image and speech models made it possible to describe a picture, transcribe a meeting or talk to a phone as naturally as to a friend. Once AI could understand ordinary language, it could be built into almost any product.</p>

<p>The result is that AI now reaches billions of people, often without them noticing. When a navigation app reroutes you around traffic, when a bank blocks a fraudulent transaction, or when your email filters out spam, a machine learning model is making that decision in the background.</p>

<h2>How AI Is Reshaping Work</h2>

<p>Work is where the change is most visible. AI is taking over many repetitive tasks that used to fill people's days: drafting routine emails, summarising long documents, writing first versions of reports, generating code, and answering common customer questions. That does not mean people are no longer needed. In most workplaces, it means the shape of a job is changing.</p>

<figure><img src="/images/articles/ai-work.svg" alt="A person working on a laptop alongside a friendly AI assistant" /><figcaption>AI takes the routine tasks so people can focus on judgement and creativity.</figcaption></figure>

<div class="pointer-grid">
  <div class="pointer-card"><img src="/images/icons/briefcase.svg" alt="" /><h4>Knowledge workers</h4><p>Use AI assistants to research faster, draft documents and analyse data, which frees time for judgement, strategy and relationships.</p></div>
  <div class="pointer-card"><img src="/images/icons/code.svg" alt="" /><h4>Software developers</h4><p>Write, test and debug code alongside AI tools, shipping features in hours that once took days.</p></div>
  <div class="pointer-card"><img src="/images/icons/store.svg" alt="" /><h4>Small businesses</h4><p>Can now afford marketing copy, customer support and bookkeeping help that used to require a dedicated team.</p></div>
  <div class="pointer-card"><img src="/images/icons/palette.svg" alt="" /><h4>Creative professionals</h4><p>Use AI to explore ideas quickly, generate mood boards and handle tedious editing, while keeping the final creative decisions for themselves.</p></div>
</div>

<p>Some roles will shrink, and new ones are already appearing: people who design AI workflows, check AI output for accuracy, and train systems on specialist knowledge. The most valuable skill in this new environment is not competing with AI but knowing how to work with it well.</p>

<h2>Healthcare: Earlier Answers, Better Care</h2>

<p>Few areas show AI's potential as clearly as healthcare. Models trained on medical images can help doctors spot signs of disease in scans and screenings, sometimes earlier than the human eye alone. AI is speeding up drug discovery by predicting how molecules will behave, a process that used to take years of trial and error. In hospitals, AI tools transcribe consultations and handle paperwork, giving doctors and nurses more time with patients.</p>

<p>For individuals, wearable devices and health apps use AI to track sleep, heart rhythm and activity, nudging people towards healthier habits and alerting them when something looks unusual. The goal is not to replace doctors but to give them, and their patients, better information sooner.</p>

<h2>Education That Adapts to Every Learner</h2>

<p>Classrooms have always struggled with one basic problem: every student learns at a different pace. AI tutors can explain a concept in several ways, offer extra practice exactly where a student is stuck, and stay patient at midnight before an exam. Language learners can hold real conversations with an AI partner. Teachers can use AI to prepare lessons, create quizzes and give faster feedback, leaving more time for the human side of teaching.</p>

<p>The same tools are opening up learning for adults. Anyone with a phone can now ask an AI to explain a tax form, teach them basic programming or summarise a difficult book. Access to a patient, knowledgeable helper is no longer limited to people who can afford private tuition.</p>

<h2>Changing Daily Life at Home</h2>

<p>Beyond work and school, AI is reshaping the small routines of daily life:</p>

<div class="pointer-grid">
  <div class="pointer-card"><img src="/images/icons/chat.svg" alt="" /><h4>Communication</h4><p>Real-time translation and transcription help people talk across languages and make content accessible to people who are deaf or hard of hearing.</p></div>
  <div class="pointer-card"><img src="/images/icons/eye.svg" alt="" /><h4>Accessibility</h4><p>AI can describe images and surroundings aloud for people with visual impairments, giving them more independence.</p></div>
  <div class="pointer-card"><img src="/images/icons/wallet.svg" alt="" /><h4>Personal finance</h4><p>Apps categorise spending, predict upcoming bills and warn about unusual activity.</p></div>
  <div class="pointer-card"><img src="/images/icons/home.svg" alt="" /><h4>Smart homes</h4><p>Thermostats, lights and assistants learn household routines and cut energy waste.</p></div>
  <div class="pointer-card"><img src="/images/icons/play.svg" alt="" /><h4>Entertainment</h4><p>Recommendations help people discover music, films and books they would never have found on their own.</p></div>
</div>

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
<ul>
  <li>The power to influence people through ideas.</li>
  <li>The power to inspire.</li>
  <li>The power to create.</li>
  <li>The power to educate.</li>
  <li>The power to build communities.</li>
  <li>The power to make people believe that something better is possible.</li>
</ul>
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
<div class="pointer-grid">
  <div class="pointer-card"><img src="/images/icons/book.svg" alt="" /><h4>Knowledge</h4><p>Your knowledge is power.</p></div>
  <div class="pointer-card"><img src="/images/icons/tools.svg" alt="" /><h4>Skills</h4><p>Your skills are power.</p></div>
  <div class="pointer-card"><img src="/images/icons/bulb.svg" alt="" /><h4>Creativity</h4><p>Your creativity is power.</p></div>
  <div class="pointer-card"><img src="/images/icons/chip.svg" alt="" /><h4>Technology</h4><p>Your technology is power.</p></div>
  <div class="pointer-card"><img src="/images/icons/megaphone.svg" alt="" /><h4>Voice</h4><p>Your voice is power.</p></div>
  <div class="pointer-card"><img src="/images/icons/clock.svg" alt="" /><h4>Time</h4><p>Your time is power.</p></div>
</div>
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
<ol>
  <li>You may have an idea for an educational platform. <strong>Build the first version.</strong></li>
  <li>You may want to solve an environmental problem. <strong>Start researching and testing solutions.</strong></li>
  <li>You may want to help your local community. <strong>Start with ten people.</strong></li>
  <li>You may want to use AI to solve a real-world problem. <strong>Learn the technology and build something.</strong></li>
</ol>
<p>It doesn't have to begin at full scale.</p>
<p>It just has to begin.</p>
<figure><img src="/images/articles/youth-ideas.svg" alt="An idea growing into a plan, a build and real impact" /><figcaption>From idea to impact: every step only happens once you start.</figcaption></figure>
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
<ul>
  <li>Do you see a world where technology makes people's lives easier?</li>
  <li>A world where education is accessible to everyone?</li>
  <li>A world where healthcare is more affordable?</li>
  <li>A world where people care more about the environment?</li>
  <li>A world where opportunities are not limited by geography?</li>
  <li>A world where humans and technology work together rather than compete?</li>
</ul>
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
<ul>
  <li>There will be failures.</li>
  <li>People may not understand your idea.</li>
  <li>Some people may tell you it won't work.</li>
  <li>You may lose motivation.</li>
  <li>You may build something that nobody uses.</li>
  <li>You may have to start again.</li>
</ul>
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
<ul>
  <li>You can learn almost anything.</li>
  <li>You can collaborate with people across the world.</li>
  <li>You can create software from your bedroom.</li>
  <li>You can publish your thoughts instantly.</li>
  <li>You can build a business without a physical office.</li>
  <li>You can use AI to accelerate research, creativity, development, and experimentation.</li>
  <li>You can find people who believe in the same idea as you.</li>
</ul>
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
<ul>
  <li>Help one person.</li>
  <li>Solve one problem.</li>
  <li>Teach one skill.</li>
  <li>Build one useful product.</li>
  <li>Create one community.</li>
  <li>Improve one process.</li>
  <li>Protect one piece of nature.</li>
  <li>Give someone an opportunity.</li>
</ul>
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
<ol>
  <li><strong>Start</strong></li>
  <li><strong>Learn</strong></li>
  <li><strong>Build</strong></li>
  <li><strong>Fail</strong></li>
  <li><strong>Improve</strong></li>
  <li><strong>Continue</strong></li>
</ol>
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


KHAMOSHI_POEM_SLUG = "khamoshi-taakat-ya-kamzori"

KHAMOSHI_POEM_CONTENT = """
<p>सब देखती हूँ, सब समझती हूँ,
हर बात पर मगर जवाब नहीं देती हूँ।
मेरी ख़ामोशी को मेरी हार मत समझना,
मैं हर बात को ज़ुबाँ देना ज़रूरी नहीं समझती हूँ।</p>
<p>लोग अक्सर मेरी चुप्पी को कमज़ोरी समझ बैठते हैं,
मेरे सब्र को मेरी मजबूरी समझ बैठते हैं।
फ़ायदा उठाते हैं मेरी ख़ामोशी का बार-बार,
और ख़ुद को समझते हैं मुझसे ज़्यादा समझदार।</p>
<p>पर उन्हें ये समझाना भी ज़रूरी नहीं समझती,
कि हर ख़ामोशी के पीछे एक कहानी होती है।
हर सहने वाले की कोई सीमा होती है,
और हर चुप रहने वाले की भी एक ज़ुबानी होती है।</p>
<p>मैं सब्र करती हूँ, हर बात सह जाती हूँ,
रिश्तों की ख़ातिर कई बार ख़ुद को समझाती हूँ।
मगर जब कोई हद से गुज़र जाता है,
तो मेरे सब्र का बाँध भी टूट जाता है।</p>
<p>फिर न शिकायत रहती है, न कोई सवाल,
न उनके बदलने का इंतज़ार, न उनके होने का ख़याल।
जो रिश्ता मेरी ख़ामोशी को समझ न सका,
वो रिश्ता मेरे टूटे सब्र के बाद ठहर न सका।</p>
<p>फिर फ़र्क नहीं पड़ता कि कौन क्या सोचता है,
कौन मुझे ग़लत, कौन ख़ुद को सही समझता है।
क्योंकि जिस दिन मैं ख़ामोशी तोड़ देती हूँ,
उस दिन सिर्फ़ बोलना नहीं, रिश्ता भी छोड़ देती हूँ।</p>
<p><strong>मेरी ख़ामोशी मेरी कमज़ोरी नहीं, मेरी ताक़त है,
मेरे सब्र में छिपी मेरे आत्मसम्मान की इज़्ज़त है।
ये मुझे लोगों के असली चेहरे दिखाती है,
कौन अपना है, कौन पराया—बिन कहे समझाती है।</strong></p>
<p>इसलिए मेरी चुप्पी को मेरी हार मत समझना,
मेरे सब्र को मेरी लाचारी मत समझना।
मैं ख़ामोश हूँ, तो बस अपने सुकून के लिए,
वरना जवाब देना मुझे भी आता है…</p>
<p><strong>बस हर किसी को उसकी औक़ात बताना
मैं ज़रूरी नहीं समझती।</strong></p>
""".strip()


SEED_ARTICLES = [
    dict(
        title="How AI is reshaping the world and people's lives",
        slug=AI_ARTICLE_SLUG,
        featured_image="/images/articles/ai-hero.svg",
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
        featured_image="/images/articles/youth-hero.svg",
        excerpt="Youth have ideas, energy and technology on their side. The real question is what we do with that power, and the missing piece is execution.",
        content=YOUTH_ARTICLE_CONTENT,
        category_id="motivation",
        featured=False,
        editors_pick=True,
        meta_title="Youth Have the Power to Change the World",
        meta_description="Young people have ideas, creativity and technology on their side. What turns that power into change is execution and determination.",
        keywords=["youth", "change the world", "motivation", "execution", "determination", "soft power"],
    ),
    dict(
        title="खामोशी — ताकत या कमज़ोरी?",
        slug=KHAMOSHI_POEM_SLUG,
        featured_image="/images/articles/khamoshi-hero.jpg",
        excerpt="मेरी ख़ामोशी मेरी कमज़ोरी नहीं, मेरी ताक़त है।",
        content=KHAMOSHI_POEM_CONTENT,
        category_id="poems",
        featured=False,
        editors_pick=False,
        meta_title="खामोशी — ताकत या कमज़ोरी? | हिंदी कविता",
        meta_description="ख़ामोशी कमज़ोरी नहीं, ताक़त है: सब्र, आत्मसम्मान और रिश्तों पर एक हिंदी कविता।",
        keywords=["hindi poem", "हिंदी कविता", "khamoshi", "ख़ामोशी", "self respect", "poems"],
    ),
]


# SHA-256 of earlier seeded content, per slug. Articles still holding one of these
# were never edited by hand, so they can safely get the latest seeded version.
PREVIOUS_SEED_HASHES = {
    AI_ARTICLE_SLUG: {"9946a980f6d7a1ed909df0d5f9f6e04ace8486c431430d05f14b5402ed233ad4"},
    YOUTH_ARTICLE_SLUG: {"f5da1f5255266578d0497686f561605f52ce4e0a9dd705d3a4e724ef03c9e73f"},
}


# Header images we seeded earlier and later replaced; an article still using one gets the new image.
OLD_SEED_IMAGES = {"/images/articles/khamoshi-hero.svg"}


def _hash(text: str) -> str:
    return hashlib.sha256((text or "").strip().encode()).hexdigest()


async def seed_admin() -> None:
    """Make sure the account in ADMIN_EMAIL / ADMIN_PASSWORD exists and is an admin."""
    email = settings.ADMIN_EMAIL.strip()
    password = settings.ADMIN_PASSWORD
    if not email or not password:
        print("ℹ️  ADMIN_EMAIL / ADMIN_PASSWORD not set; no admin account seeded.")
        return
    user = await User.find_one(User.email == email)
    if not user:
        await User(
            name=settings.ADMIN_NAME, email=email,
            password_hash=hash_password(password),
            role=UserRole.admin, is_verified=True,
        ).insert()
        print(f"✅ Admin account created: {email}")
        return
    changed = False
    if user.role != UserRole.admin:
        user.role = UserRole.admin
        changed = True
    if not user.password_hash or not verify_password(password, user.password_hash):
        user.password_hash = hash_password(password)
        changed = True
    if not user.is_verified:
        user.is_verified = True
        changed = True
    if changed:
        user.updated_at = datetime.utcnow()
        await user.save()
        print(f"✅ Admin account updated: {email}")
    else:
        print(f"✅ Admin account ready: {email}")


async def seed_articles() -> None:
    admin = await User.find_one(User.role == UserRole.admin)
    for data in SEED_ARTICLES:
        existing = await Article.find_one(Article.slug == data["slug"])
        if existing:
            changed = False
            if existing.content != data["content"] and _hash(existing.content) in PREVIOUS_SEED_HASHES.get(data["slug"], set()):
                existing.content = data["content"]
                existing.read_time = _read_time(data["content"])
                changed = True
            if data.get("featured_image") and (not existing.featured_image or existing.featured_image in OLD_SEED_IMAGES):
                existing.featured_image = data["featured_image"]
                changed = True
            if changed:
                await existing.save()
            continue
        await Article(
            **data,
            author_id=str(admin.id) if admin else "life-tech-team",
            status=ArticleStatus.published,
            published_at=datetime.utcnow(),
            read_time=_read_time(data["content"]),
        ).insert()
