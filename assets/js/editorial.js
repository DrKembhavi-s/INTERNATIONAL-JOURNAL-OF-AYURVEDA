// Editorial Dashboard JavaScript - International Journal of Ayurveda

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const currentUserSpan = document.getElementById('currentUser');
    
    // Demo credentials
    const validCredentials = {
        'editor': 'ayurveda2025',
        'admin': 'admin123',
        'reviewer': 'review2025'
    };
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('ija_current_user');
    if (currentUser) {
        showDashboard(currentUser);
    }
    
    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    function handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Clear any existing error messages
        clearMessages();
        
        if (!username || !password) {
            showMessage('Please enter both username and password.', 'error');
            return;
        }
        
        // Check credentials
        if (validCredentials[username] && validCredentials[username] === password) {
            // Successful login
            localStorage.setItem('ija_current_user', username);
            showDashboard(username);
            showMessage('Login successful!', 'success');
        } else {
            showMessage('Invalid username or password.', 'error');
        }
    }
    
    function handleLogout() {
        localStorage.removeItem('ija_current_user');
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        
        // Clear form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        showMessage('Logged out successfully.', 'success');
    }
    
    function showDashboard(username) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        currentUserSpan.textContent = capitalize(username);
        
        // Initialize dashboard data
        initializeDashboard();
    }
    
    function showMessage(text, type) {
        clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.style.cssText = `
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            font-weight: bold;
            text-align: center;
        `;
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        }
        
        messageDiv.textContent = text;
        
        const loginBox = document.querySelector('.login-box');
        if (loginBox) {
            loginBox.insertBefore(messageDiv, loginBox.firstChild);
        }
        
        // Auto-remove message after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
    
    function clearMessages() {
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
    }
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Initialize dashboard with sample data
    function initializeDashboard() {
        // Update statistics
        updateStatistics();
        
        // Load sample submissions
        loadSampleSubmissions();
        
        // Initialize filters
        initializeFilters();
    }
    
    function updateStatistics() {
        // Get sample submission data
        const submissions = getSampleSubmissions();
        
        document.getElementById('totalSubmissions').textContent = submissions.length;
        document.getElementById('underReview').textContent = 
            submissions.filter(s => s.status === 'under-review').length;
        document.getElementById('accepted').textContent = 
            submissions.filter(s => s.status === 'accepted').length;
        document.getElementById('published').textContent = 0;
    }
    
    function getSampleSubmissions() {
        return [
            {
                id: 'IJA-1704067200',
                title: 'Clinical Efficacy of Triphala in Digestive Disorders: A Randomized Control Trial',
                author: 'Dr. Ramesh Kumar',
                institution: 'AIIMS Delhi',
                submitted: 'Jan 1, 2025',
                type: 'Original Research',
                status: 'pending',
                specialization: 'kayachikitsa'
            },
            {
                id: 'IJA-1704067300',
                title: 'Ayurvedic Management of Diabetes Mellitus: A Systematic Review',
                author: 'Dr. Priya Sharma',
                institution: 'BAMS College, Mumbai',
                submitted: 'Dec 28, 2024',
                type: 'Review Article',
                status: 'under-review',
                specialization: 'kayachikitsa'
            },
            {
                id: 'IJA-1704067400',
                title: 'Panchakarma Therapy in Rheumatoid Arthritis: A Case Series',
                author: 'Dr. Arun Joshi',
                institution: 'Kerala Ayurveda College',
                submitted: 'Dec 25, 2024',
                type: 'Case Study',
                status: 'accepted',
                specialization: 'panchakarma'
            }
        ];
    }
    
    function loadSampleSubmissions() {
        // This would normally load from a database
        // For now, we'll use the existing HTML samples
        console.log('Sample submissions loaded');
    }
    
    function initializeFilters() {
        const statusFilter = document.getElementById('statusFilter');
        const specializationFilter = document.getElementById('specializationFilter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', filterSubmissions);
        }
        if (specializationFilter) {
            specializationFilter.addEventListener('change', filterSubmissions);
        }
    }
    
    function filterSubmissions() {
        const statusFilter = document.getElementById('statusFilter').value;
        const specializationFilter = document.getElementById('specializationFilter').value;
        
        const submissionItems = document.querySelectorAll('.submission-item');
        
        submissionItems.forEach(item => {
            let showItem = true;
            
            // Check status filter
            if (statusFilter !== 'all') {
                const statusElement = item.querySelector('.submission-status');
                if (statusElement) {
                    const itemStatus = statusElement.textContent.toLowerCase().replace(' ', '-');
                    if (!itemStatus.includes(statusFilter)) {
                        showItem = false;
                    }
                }
            }
            
            // Show/hide item
            item.style.display = showItem ? 'block' : 'none';
        });
        
        // Show "no data" message if no items are visible
        const visibleItems = document.querySelectorAll('.submission-item[style*="block"], .submission-item:not([style*="none"])');
        const noDataElement = document.getElementById('noSubmissions');
        if (visibleItems.length === 0 && noDataElement) {
            noDataElement.style.display = 'block';
        } else if (noDataElement) {
            noDataElement.style.display = 'none';
        }
    }
});

// Global functions for submission actions
function viewSubmission(submissionId) {
    alert(`Viewing submission: ${submissionId}\n\nIn a full implementation, this would open the detailed submission view with the complete manuscript, author information, and review history.`);
}

function assignReviewer(submissionId) {
    const reviewers = ['Dr. Anil Gupta', 'Dr. Meera Patel', 'Dr. Suresh Nair', 'Dr. Priya Reddy'];
    const selectedReviewer = prompt(`Assign reviewer for ${submissionId}:\n\nAvailable reviewers:\n${reviewers.join('\n')}\n\nEnter reviewer name:`);
    
    if (selectedReviewer && reviewers.includes(selectedReviewer)) {
        alert(`Reviewer ${selectedReviewer} has been assigned to ${submissionId}.`);
        // In a real system, this would update the database
        console.log(`Assigned ${selectedReviewer} to ${submissionId}`);
    } else if (selectedReviewer) {
        alert('Reviewer not found. Please select from the available reviewers.');
    }
}

function requestRevision(submissionId) {
    const comments = prompt(`Request revision for ${submissionId}:\n\nEnter revision comments for the author:`);
    
    if (comments) {
        alert(`Revision request sent to author for ${submissionId}.`);
        // Update status to revision required
        const submissionElement = document.querySelector(`[onclick*="${submissionId}"]`).closest('.submission-item');
        const statusElement = submissionElement.querySelector('.submission-status');
        if (statusElement) {
            statusElement.textContent = 'Revision Required';
            statusElement.className = 'submission-status revision';
            statusElement.style.backgroundColor = '#fff3cd';
            statusElement.style.color = '#856404';
        }
        console.log(`Revision requested for ${submissionId}: ${comments}`);
    }
}

function acceptSubmission(submissionId) {
    const confirm = window.confirm(`Accept submission ${submissionId} for publication?`);
    
    if (confirm) {
        alert(`Submission ${submissionId} has been accepted!`);
        // Update status to accepted
        const submissionElement = document.querySelector(`[onclick*="${submissionId}"]`).closest('.submission-item');
        const statusElement = submissionElement.querySelector('.submission-status');
        if (statusElement) {
            statusElement.textContent = 'Accepted';
            statusElement.className = 'submission-status accepted';
        }
        
        // Update statistics
        const acceptedCount = document.getElementById('accepted');
        if (acceptedCount) {
            acceptedCount.textContent = parseInt(acceptedCount.textContent) + 1;
        }
        
        console.log(`Accepted submission: ${submissionId}`);
    }
}

function rejectSubmission(submissionId) {
    const reason = prompt(`Reject submission ${submissionId}:\n\nEnter rejection reason:`);
    
    if (reason) {
        const confirm = window.confirm(`Are you sure you want to reject this submission?\n\nReason: ${reason}`);
        
        if (confirm) {
            alert(`Submission ${submissionId} has been rejected.`);
            // Update status to rejected
            const submissionElement = document.querySelector(`[onclick*="${submissionId}"]`).closest('.submission-item');
            const statusElement = submissionElement.querySelector('.submission-status');
            if (statusElement) {
                statusElement.textContent = 'Rejected';
                statusElement.className = 'submission-status rejected';
            }
            console.log(`Rejected submission ${submissionId}: ${reason}`);
        }
    }
}

function viewReviewComments(submissionId) {
    alert(`Review comments for ${submissionId}:\n\n[Sample Review Comments]\n\nReviewer 1 (Dr. Anil Gupta):\n- Methodology is sound but needs more detail\n- Statistical analysis is appropriate\n- Literature review could be expanded\n- Minor formatting issues\n\nOverall recommendation: Minor revision required\n\nReviewer 2 (Dr. Meera Patel):\n- Innovative approach to traditional treatment\n- Results are well-presented\n- Discussion section is comprehensive\n- References are up-to-date\n\nOverall recommendation: Accept with minor revisions`);
}

function addReviewer() {
    const name = prompt('Add New Reviewer:\n\nEnter reviewer name:');
    if (name) {
        const specialization = prompt('Enter specialization:');
        const institution = prompt('Enter institution:');
        
        if (specialization && institution) {
            alert(`New reviewer added:\n\nName: ${name}\nSpecialization: ${specialization}\nInstitution: ${institution}\n\nReviewer has been notified and can now be assigned to submissions.`);
            console.log('New reviewer added:', { name, specialization, institution });
        }
    }
}

function createNewIssue() {
    const volume = prompt('Create New Issue:\n\nEnter volume number:');
    if (volume) {
        const issue = prompt('Enter issue number:');
        const targetDate = prompt('Enter target publication date (YYYY-MM-DD):');
        
        if (issue && targetDate) {
            alert(`New issue created:\n\nVolume ${volume}, Issue ${issue}\nTarget Date: ${targetDate}\n\nYou can now assign accepted articles to this issue.`);
            console.log('New issue created:', { volume, issue, targetDate });
        }
    }
}
