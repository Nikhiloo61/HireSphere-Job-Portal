cat << 'INNER_EOF' > backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
INNER_EOF

cat << 'INNER_EOF' > backend/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const { getJobs, getJobById } = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/:id', getJobById);

module.exports = router;
INNER_EOF

cat << 'INNER_EOF' > backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { applyJob, getApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, applyJob);
router.get('/', protect, getApplications);

module.exports = router;
INNER_EOF

cat << 'INNER_EOF' > backend/routes/savedJobRoutes.js
const express = require('express');
const router = express.Router();
const { saveJob, removeSavedJob, getSavedJobs } = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveJob);
router.delete('/:jobId', protect, removeSavedJob);
router.get('/', protect, getSavedJobs);

module.exports = router;
INNER_EOF

cat << 'INNER_EOF' > backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
INNER_EOF

cat << 'INNER_EOF' > backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Job = require('./models/Job');
const User = require('./models/User');
const Application = require('./models/Application');
const SavedJob = require('./models/SavedJob');

// Read jobs data file, bypassing export default
const fs = require('fs');
const path = require('path');
const jobsDataPath = path.join(__dirname, '../src/data/jobsData.js');
let fileContent = fs.readFileSync(jobsDataPath, 'utf-8');
fileContent = fileContent.replace('export default jobsData;', 'module.exports = jobsData;');

const tempFilePath = path.join(__dirname, 'tempJobsData.js');
fs.writeFileSync(tempFilePath, fileContent);
const jobsData = require('./tempJobsData');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    await Job.deleteMany();
    await User.deleteMany();
    await Application.deleteMany();
    await SavedJob.deleteMany();

    const jobs = jobsData.map(job => {
        const { id, ...rest } = job;
        return rest;
    });

    await Job.insertMany(jobs);
    console.log('Data Imported!');
    fs.unlinkSync(tempFilePath);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
INNER_EOF

