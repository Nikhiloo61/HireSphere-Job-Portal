const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const SavedJob = require('./models/SavedJob');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hiresphere';

const seedData = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected successfully for seeding.');

    // 1. Clear existing collections
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await SavedJob.deleteMany({});
    console.log('Cleared existing database records.');

    // 2. Create Admin Account (Mongoose pre-save hashes plain password)
    const admin = await User.create({
      name: 'System Admin',
      fullName: 'System Admin',
      email: 'admin@hiresphere.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1-800-555-0100',
      location: 'San Francisco, CA',
      skills: 'System Administration, Cloud Security, Database Management',
      education: 'M.S. in Computer Science, Stanford University',
      experience: '8+ years'
    });

    // 3. Create 2 Recruiter Accounts
    const recruiter1 = await User.create({
      name: 'Sarah Jenkins',
      fullName: 'Sarah Jenkins',
      email: 'recruiter1@techcorp.com',
      password: 'recruiter123',
      role: 'recruiter',
      phone: '+1-555-234-5678',
      location: 'New York, NY',
      skills: 'Technical Recruiting, Talent Acquisition, Engineering Hiring',
      education: 'B.A. in Human Resources, NYU',
      experience: '5 years'
    });

    const recruiter2 = await User.create({
      name: 'David Miller',
      fullName: 'David Miller',
      email: 'recruiter2@cloudscale.io',
      password: 'recruiter123',
      role: 'recruiter',
      phone: '+1-555-876-5432',
      location: 'Austin, TX',
      skills: 'Executive Search, Sourcing, Cloud & AI Recruiting',
      education: 'B.S. in Business Administration, UT Austin',
      experience: '6 years'
    });

    // 4. Create 5 Candidate Accounts
    const candidate1 = await User.create({
      name: 'Alex Chen',
      fullName: 'Alex Chen',
      email: 'alex.chen@example.com',
      password: 'candidate123',
      role: 'candidate',
      phone: '+1-555-312-9876',
      location: 'Seattle, WA',
      skills: 'React, Node.js, TypeScript, Docker, Next.js',
      education: 'B.S. Computer Science, University of Washington',
      experience: '3 years Full Stack Developer',
      resumeUrl: 'https://alexchen.dev/resume.pdf',
      githubUrl: 'https://github.com/alexchen',
      linkedinUrl: 'https://linkedin.com/in/alexchen',
      portfolioUrl: 'https://alexchen.dev'
    });

    const candidate2 = await User.create({
      name: 'Priya Patel',
      fullName: 'Priya Patel',
      email: 'priya.patel@example.com',
      password: 'candidate123',
      role: 'candidate',
      phone: '+1-555-456-1122',
      location: 'San Jose, CA',
      skills: 'Python, Machine Learning, PyTorch, TensorFlow, SQL',
      education: 'M.S. Artificial Intelligence, UC Berkeley',
      experience: '4 years ML Engineer',
      resumeUrl: 'https://priyapatel.ai/resume.pdf',
      githubUrl: 'https://github.com/priyapatel',
      linkedinUrl: 'https://linkedin.com/in/priyapatel',
      portfolioUrl: 'https://priyapatel.ai'
    });

    const candidate3 = await User.create({
      name: 'Marcus Vance',
      fullName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      password: 'candidate123',
      role: 'candidate',
      phone: '+1-555-789-3344',
      location: 'Chicago, IL',
      skills: 'Go, Kubernetes, AWS, Terraform, Microservices',
      education: 'B.S. Software Engineering, UIUC',
      experience: '5 years DevOps & Backend Engineer',
      resumeUrl: 'https://marcusvance.io/resume.pdf',
      githubUrl: 'https://github.com/marcusvance',
      linkedinUrl: 'https://linkedin.com/in/marcusvance'
    });

    const candidate4 = await User.create({
      name: 'Elena Rostova',
      fullName: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      password: 'candidate123',
      role: 'candidate',
      phone: '+1-555-654-7788',
      location: 'Remote, US',
      skills: 'UI/UX Design, Figma, React, CSS3, Design Systems',
      education: 'B.Des. Interaction Design, Rhode Island School of Design',
      experience: '3 years Product Designer',
      resumeUrl: 'https://elenarostova.design/resume.pdf',
      portfolioUrl: 'https://elenarostova.design',
      linkedinUrl: 'https://linkedin.com/in/elenarostova'
    });

    const candidate5 = await User.create({
      name: 'Jordan Taylor',
      fullName: 'Jordan Taylor',
      email: 'jordan.taylor@example.com',
      password: 'candidate123',
      role: 'candidate',
      phone: '+1-555-987-0011',
      location: 'Boston, MA',
      skills: 'Java, Spring Boot, PostgreSQL, Kafka, Redis',
      education: 'B.S. Computer Engineering, Northeastern University',
      experience: '2 years Backend Developer',
      resumeUrl: 'https://jordantaylor.tech/resume.pdf',
      githubUrl: 'https://github.com/jordantaylor',
      linkedinUrl: 'https://linkedin.com/in/jordantaylor'
    });

    console.log('Users created successfully (1 Admin, 2 Recruiters, 5 Candidates).');

    // 5. Create 10 Sample Job Listings
    const jobs = await Job.insertMany([
      {
        title: 'Senior Full Stack Engineer',
        company: 'TechCorp Labs',
        logo: 'T',
        companyLogo: 'T',
        description: 'Lead architecture and development of scalable cloud web applications using modern React, TypeScript, and Node.js microservices. Collaborate with product design and infrastructure teams.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        employmentType: 'Full-time',
        salary: '18-24 LPA',
        salaryMin: 18,
        salaryMax: 24,
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
        experience: '4-7 years',
        experienceLevel: 'Senior-level',
        category: 'Engineering',
        recruiter: recruiter1._id,
        recruiterId: recruiter1._id,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      },
      {
        title: 'Machine Learning Research Engineer',
        company: 'Cognitive AI',
        logo: 'C',
        companyLogo: 'C',
        description: 'Design, train, and deploy cutting-edge neural architectures and large language model inference pipelines for enterprise production workloads.',
        location: 'San Jose, CA',
        type: 'Full-time',
        employmentType: 'Full-time',
        salary: '22-30 LPA',
        salaryMin: 22,
        salaryMax: 30,
        skills: ['Python', 'PyTorch', 'Machine Learning', 'TensorFlow', 'Docker'],
        experience: '3-6 years',
        experienceLevel: 'Mid-level',
        category: 'AI & Data Science',
        recruiter: recruiter2._id,
        recruiterId: recruiter2._id,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      },
      {
        title: 'Cloud Infrastructure & DevOps Architect',
        company: 'CloudScale Systems',
        logo: 'S',
        companyLogo: 'S',
        description: 'Build enterprise Kubernetes clusters, Terraform automation, and secure CI/CD deployment pipelines spanning hybrid multi-region cloud infrastructures.',
        location: 'Austin, TX',
        type: 'Full-time',
        employmentType: 'Full-time',
        salary: '20-26 LPA',
        salaryMin: 20,
        salaryMax: 26,
        skills: ['Kubernetes', 'Go', 'AWS', 'Terraform', 'Docker'],
        experience: '5+ years',
        experienceLevel: 'Senior-level',
        category: 'DevOps & Cloud',
        recruiter: recruiter2._id,
        recruiterId: recruiter2._id,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      },
      {
        title: 'Frontend UI/UX Developer',
        company: 'PixelCraft Digital',
        logo: 'P',
        companyLogo: 'P',
        description: 'Craft responsive, pixel-perfect user experiences and interactive component design systems for web and mobile productivity applications.',
        location: 'Remote',
        type: 'Remote',
        employmentType: 'Remote',
        salary: '12-16 LPA',
        salaryMin: 12,
        salaryMax: 16,
        skills: ['React', 'TypeScript', 'CSS3', 'Figma', 'UI/UX Design'],
        experience: '2-4 years',
        experienceLevel: 'Mid-level',
        category: 'Design & Frontend',
        recruiter: recruiter1._id,
        recruiterId: recruiter1._id,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      },
      {
        title: 'Backend Platform Engineer (Go / Distributed Systems)',
        company: 'PulseStream Networks',
        logo: 'N',
        companyLogo: 'N',
        description: 'Scale distributed event-driven data streaming backends handling millions of concurrent socket connections with microsecond latency requirements.',
        location: 'Seattle, WA',
        type: 'Full-time',
        employmentType: 'Full-time',
        salary: '17-23 LPA',
        salaryMin: 17,
        salaryMax: 23,
        skills: ['Go', 'Kafka', 'PostgreSQL', 'Redis', 'Microservices'],
        experience: '3-5 years',
        experienceLevel: 'Mid-level',
        category: 'Engineering',
        recruiter: recruiter2._id,
        recruiterId: recruiter2._id,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      },
      {
        title: 'Cybersecurity & AppSec Specialist',
        company: 'Fortress Cyber Solutions',
        logo: 'F',
        companyLogo: 'F',
        description: 'Perform vulnerability assessments, penetration testing, threat modeling, and secure software development lifecycle enforcement across company platforms.',
        location: 'Washington, DC',
        type: 'Full-time',
        employmentType: 'Full-time',
        salary: '19-25 LPA',
        salaryMin: 19,
        salaryMax: 25,
        skills: ['Cyber Security', 'Penetration Testing', 'Python', 'Linux', 'OWASP'],
        experience: '4-7 years',
        experienceLevel: 'Senior-level',
        category: 'Security',
        recruiter: recruiter1._id,
        recruiterId: recruiter1._id,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      },
      {
        title: 'Junior React Frontend Engineer',
        company: 'NovaTech Ventures',
        logo: 'V',
        companyLogo: 'V',
        description: 'Join an agile product engineering team building dashboards, form wizards, and customer self-service portals with React and Bootstrap.',
        location: 'Chicago, IL',
        type: 'Full-time',
        employmentType: 'Full-time',
        salary: '6-10 LPA',
        salaryMin: 6,
        salaryMax: 10,
        skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap'],
        experience: '0-2 years',
        experienceLevel: 'Entry-level',
        category: 'Engineering',
        recruiter: recruiter1._id,
        recruiterId: recruiter1._id,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      },
      {
        title: 'Data Analyst & BI Specialist',
        company: 'OmniMetrics Analytics',
        logo: 'O',
        companyLogo: 'O',
        description: 'Transform complex business datasets into clear insights, automated executive reporting dashboards, and forecasting models.',
        location: 'Boston, MA',
        type: 'Full-time',
        employmentType: 'Full-time',
        salary: '10-15 LPA',
        salaryMin: 10,
        salaryMax: 15,
        skills: ['SQL', 'Python', 'PowerBI', 'Tableau', 'Data Analysis'],
        experience: '2-4 years',
        experienceLevel: 'Mid-level',
        category: 'AI & Data Science',
        recruiter: recruiter2._id,
        recruiterId: recruiter2._id,
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      },
      {
        title: 'Product Design Lead',
        company: 'Aura Studio',
        logo: 'A',
        companyLogo: 'A',
        description: 'Shape the creative product vision, lead user discovery research interviews, and maintain Figma component libraries for flagship web products.',
        location: 'New York, NY',
        type: 'Contract',
        employmentType: 'Contract',
        salary: '16-22 LPA',
        salaryMin: 16,
        salaryMax: 22,
        skills: ['Figma', 'UI/UX Design', 'User Research', 'Prototyping'],
        experience: '5+ years',
        experienceLevel: 'Senior-level',
        category: 'Design & Frontend',
        recruiter: recruiter1._id,
        recruiterId: recruiter1._id,
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      },
      {
        title: 'Enterprise Java / Spring Developer',
        company: 'Vanguard FinTech Group',
        logo: 'G',
        companyLogo: 'G',
        description: 'Build fault-tolerant payment transaction processing microservices and compliance reporting engines adhering to strict regulatory protocols.',
        location: 'Charlotte, NC',
        type: 'Full-time',
        employmentType: 'Full-time',
        salary: '15-20 LPA',
        salaryMin: 15,
        salaryMax: 20,
        skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Docker'],
        experience: '3-5 years',
        experienceLevel: 'Mid-level',
        category: 'Engineering',
        recruiter: recruiter2._id,
        recruiterId: recruiter2._id,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        postedDate: new Date().toISOString().slice(0, 10)
      }
    ]);

    console.log(`Created ${jobs.length} realistic job listings.`);

    // 6. Create Sample Applications
    const applications = await Application.insertMany([
      {
        user: candidate1._id,
        candidate: candidate1._id,
        job: jobs[0]._id, // Senior Full Stack Engineer at TechCorp Labs
        status: 'Under Review',
        coverLetter: 'I have 3+ years of building full-stack applications with React, Node.js and MongoDB. Excited about TechCorp Labs!',
        resumeUrl: 'https://alexchen.dev/resume.pdf',
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        user: candidate1._id,
        candidate: candidate1._id,
        job: jobs[3]._id, // Frontend UI/UX at PixelCraft
        status: 'Shortlisted',
        coverLetter: 'Passionate about clean UI architecture and design systems.',
        resumeUrl: 'https://alexchen.dev/resume.pdf',
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        user: candidate2._id,
        candidate: candidate2._id,
        job: jobs[1]._id, // Machine Learning Research Engineer at Cognitive AI
        status: 'Under Review',
        coverLetter: 'Specialized in neural networks and PyTorch inference pipelines from UC Berkeley.',
        resumeUrl: 'https://priyapatel.ai/resume.pdf',
        appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        user: candidate3._id,
        candidate: candidate3._id,
        job: jobs[2]._id, // Cloud Infrastructure at CloudScale Systems
        status: 'Shortlisted',
        coverLetter: 'Extensive hands-on experience orchestrating Kubernetes and multi-cloud Terraform setups.',
        resumeUrl: 'https://marcusvance.io/resume.pdf',
        appliedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        user: candidate4._id,
        candidate: candidate4._id,
        job: jobs[8]._id, // Product Design Lead at Aura Studio
        status: 'Applied',
        coverLetter: 'Eager to lead product design and research systems.',
        resumeUrl: 'https://elenarostova.design/resume.pdf',
        appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        user: candidate5._id,
        candidate: candidate5._id,
        job: jobs[9]._id, // Java Spring Developer at Vanguard
        status: 'Accepted',
        coverLetter: 'Proficient in Java Spring Boot microservices, high-throughput Kafka streaming, and PostgreSQL.',
        resumeUrl: 'https://jordantaylor.tech/resume.pdf',
        appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log(`Created ${applications.length} sample applications.`);

    // 7. Create Sample Saved Jobs
    const savedJobs = await SavedJob.insertMany([
      {
        user: candidate1._id,
        candidate: candidate1._id,
        job: jobs[1]._id // Alex Chen saved ML job
      },
      {
        user: candidate1._id,
        candidate: candidate1._id,
        job: jobs[2]._id // Alex Chen saved Cloud job
      },
      {
        user: candidate2._id,
        candidate: candidate2._id,
        job: jobs[7]._id // Priya Patel saved Data Analyst
      },
      {
        user: candidate3._id,
        candidate: candidate3._id,
        job: jobs[4]._id // Marcus saved Go job
      }
    ]);

    console.log(`Created ${savedJobs.length} sample saved jobs.`);

    console.log('\n================ SEEDING COMPLETE ================');
    console.log('Credentials Summary:');
    console.log('----------------------------------------------------');
    console.log('ADMIN:');
    console.log('  Email:    admin@hiresphere.com');
    console.log('  Password: admin123');
    console.log('RECRUITERS:');
    console.log('  1) Email: recruiter1@techcorp.com   | Password: recruiter123');
    console.log('  2) Email: recruiter2@cloudscale.io  | Password: recruiter123');
    console.log('CANDIDATES:');
    console.log('  1) Email: alex.chen@example.com      | Password: candidate123');
    console.log('  2) Email: priya.patel@example.com    | Password: candidate123');
    console.log('  3) Email: marcus.vance@example.com   | Password: candidate123');
    console.log('  4) Email: elena.rostova@example.com  | Password: candidate123');
    console.log('  5) Email: jordan.taylor@example.com  | Password: candidate123');
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
