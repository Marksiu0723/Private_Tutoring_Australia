export type Language = 'en' | 'zh';

export interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

export const translations = {
  // Navigation
  'nav.home': { en: 'Home', zh: '首页' },
  'nav.tutoring': { en: 'Tutoring', zh: '课程辅导' },
  'nav.about': { en: 'About', zh: '教学理念' },
  'nav.packages': { en: 'Packages', zh: '课程套餐' },
  'nav.book': { en: 'Book a Lesson', zh: '预约课程' },
  'nav.clientPortal': { en: 'Client Portal', zh: '学员中心' },
  'nav.admin': { en: 'Admin', zh: '管理后台' },
  'nav.signOut': { en: 'Sign Out', zh: '退出登录' },
  'nav.searchPlaceholder': { en: 'Search subjects, HSC...', zh: '搜索课程、HSC科目...' },
  'nav.hours': { en: 'Mon - Sun: 09:00 - 21:00', zh: '周一至周日: 09:00 - 21:00' },
  'nav.location': { en: 'Sydney, NSW • Online', zh: '悉尼 • 线上辅导' },
  'nav.contact': { en: 'Contact', zh: '咨询与联系' },

  // Hero
  'hero.badge': { en: 'Specialist Science Education • Sydney, Australia', zh: '专业中学生物与化学学科辅导 • 悉尼' },
  'hero.title': { en: 'Master Secondary Science with Personalised Mentorship', zh: '个性化私教辅导，扎实掌握中学与HSC科学' },
  'hero.subtitle': {
    en: 'Empowering Year 7–10 students to build resilient science foundations and providing rigorous HSC Chemistry & Biology exam preparation for Years 11–12.',
    zh: '为7–10年级学生夯实科学核心素养，为11–12年级HSC考生提供深度的化学与生物冲刺与概念精讲。',
  },
  'hero.ctaBook': { en: 'Schedule Your Lesson', zh: '预约辅导课程' },
  'hero.ctaExplore': { en: 'Explore Services', zh: '查看辅导科目' },
  'hero.feature1': { en: '1-on-1 Tailored Syllabus', zh: '一对一个性化教学大纲' },
  'hero.feature2': { en: 'Structured HSC Past Papers', zh: '系统化HSC考卷与答题训练' },
  'hero.feature3': { en: 'Flexible 7-Day Scheduling', zh: '每周7天灵活自主排课' },

  // Services
  'services.title': { en: 'Tutoring Services', zh: '辅导科目与服务' },
  'services.heading': { en: 'Targeted Scientific Instruction', zh: '精准对标新州教学大纲的科学辅导' },
  'services.subtitle': {
    en: 'Targeted scientific instruction calibrated to the NSW syllabus and individual student pace.',
    zh: '严格对照新南威尔士州教学大纲（NSW Syllabus），因材施教。',
  },
  'services.duration': { en: 'Duration', zh: '课时' },
  'services.minutes': { en: 'minutes', zh: '分钟' },
  'services.audPerSession': { en: 'AUD / session', zh: '澳元 / 课时' },
  'services.pricePending': { en: 'Price subject to change', zh: '课时费待定（请咨询）' },
  'services.bookBtn': { en: 'Book This Lesson', zh: '预约此课程' },
  'services.juniorBadge': { en: 'Years 7–10 Foundations', zh: '7–10年级 科学通识基础' },
  'services.hscBadge': { en: 'Years 11–12 HSC Mastery', zh: '11–12年级 HSC高阶提分' },
  'services.srvJuniorName': { en: 'Junior Year (Year 7 - 10)', zh: '初中科学综合（7 - 10年级）' },
  'services.srvJuniorDesc': {
    en: 'Personalised science foundation lessons that cover all strands to build a strong base for senior study.',
    zh: '个性化科学基础辅导，全面覆盖四大知识领域，为高年级理科奠定扎实学术根基。',
  },
  'services.srvJuniorH1': { en: 'Comprehensive Stage 4 & 5 Core Strands', zh: '全面覆盖Stage 4与5阶段核心知识模块' },
  'services.srvJuniorH2': { en: 'Working Scientifically & Inquiry Skills', zh: '实验探究设计与科学思维综合训练' },
  'services.srvJuniorH3': { en: 'Early Preparation for Stage 6 Science', zh: '提前衔接Stage 6高阶理科核心考点' },
  'services.srvHscName': { en: 'HSC (Year 11 - 12)', zh: 'HSC高阶辅导（11 - 12年级）' },
  'services.srvHscDesc': {
    en: 'Chemistry / Biology.',
    zh: '化学 / 生物学专项深度辅导。',
  },
  'services.srvHscH1': { en: 'HSC Chemistry Modules 1–8 Deep Dive', zh: 'HSC化学模块1–8全面深度精讲' },
  'services.srvHscH2': { en: 'HSC Biology Modules 1–8 Syllabus Coverage', zh: 'HSC生物模块1–8大纲考点全面突破' },
  'services.srvHscH3': { en: 'Past Paper Analysis & Extended Response Technique', zh: '历年HSC真题剖析与高分长答题技巧' },

  // Why Section
  'why.title': { en: 'Why Personalised Science Tutoring Matters', zh: '为什么选择一对一科学私教？' },
  'why.subtitle': {
    en: 'Moving beyond rote memorisation to build deep conceptual understanding and scientific reasoning.',
    zh: '告别机械死记硬背，培养深层科学思维、实验探究逻辑与精准学术表达。',
  },
  'why.point1.title': { en: 'Concept-First Mastery', zh: '概念优先，知其所以然' },
  'why.point1.desc': {
    en: 'Science is not a collection of isolated facts. We deconstruct complex biological systems and chemical mechanisms until they are intuitive.',
    zh: '科学并非孤立的事实堆砌。我们将复杂的生物学系统和化学反应机理拆解讲透，建立清晰心智模型。',
  },
  'why.point2.title': { en: 'HSC Marking Rubric Precision', zh: '精细对接HSC评分标准' },
  'why.point2.desc': {
    en: 'Many students understand the science but drop marks on keyword requirements and long-response structuring. We practice exam-targeted answer technique.',
    zh: '许多学生理解内容却往往在长答题结构与关键词踩分点上失分。我们重点强化标准学术答题逻辑。',
  },
  'why.point3.title': { en: 'Consistent Academic Rhythm', zh: '规律节奏与长期信心' },
  'why.point3.desc': {
    en: 'Weekly or fortnightly sessions ensure assessments and depth studies never become overwhelming. Students enter exams calm and prepared.',
    zh: '通过每周或双周的规律辅导，平稳消化深度课题与期末模考，帮助学生建立沉稳自信。',
  },

  // Deep dive sections
  'deep.junior.title': { en: 'Junior Science (Years 7–10)', zh: '初中科学强化（7–10年级）' },
  'deep.junior.desc': {
    en: 'The transition to senior science begins in Year 7. We cover Physics, Chemistry, Biology, and Earth & Space science strands, developing critical analysis and scientific literacy.',
    zh: '高中科目的扎实根基始于初中。课程全面覆盖物理、化学、生物与地球空间科学四大支柱，培养科学探究能力。',
  },
  'deep.junior.f1': { en: 'Scientific Inquiry & Working Scientifically skills', zh: '实验探究设计与科学考察技能' },
  'deep.junior.f2': { en: 'Core chemical bonding & atomic structure fundamentals', zh: '化学键与原子结构入门剖析' },
  'deep.junior.f3': { en: 'Cellular biology, genetics & ecosystems foundations', zh: '细胞生物学、遗传学与生态系统基础' },
  'deep.junior.f4': { en: 'Early preparation for Stage 6 senior subject selection', zh: '为11年级高年级理科选课打下先行优势' },

  'deep.hsc.title': { en: 'Senior HSC Chemistry & Biology (Years 11–12)', zh: '高年级 HSC 化学与生物冲刺（11–12年级）' },
  'deep.hsc.desc': {
    en: 'Comprehensive Stage 6 syllabus coverage. Whether navigating Equilibrium & Acid Reactions in Chemistry or Infectious Disease & Heredity in Biology, lessons are tailored to your target ATAR.',
    zh: '全面覆盖Stage 6大纲。无论是化学的平衡常数、酸碱反应与有机合成，还是生物的遗传密码与传染病机理，均紧扣高分考点。',
  },
  'deep.hsc.f1': { en: 'Chemistry: Modules 1–8 including Organic Chemistry & Analysis', zh: '化学大纲模块1–8深入剖析（含酸碱平衡与有机化学）' },
  'deep.hsc.f2': { en: 'Biology: Modules 1–8 from Cells to Genetic Technologies', zh: '生物大纲模块1–8系统精讲（含遗传技术与免疫系统）' },
  'deep.hsc.f3': { en: 'NESA past exam deconstruction & band-6 response modeling', zh: 'NESA历年考卷拆解与高分示范作答' },
  'deep.hsc.f4': { en: 'Depth Study consultation & practical exam guidance', zh: '深度探究报告（Depth Study）指导与实验题答题思路' },

  // Packages
  'packages.badge': { en: 'Structured Tutoring Plans', zh: '辅导方案体系' },
  'packages.title': { en: 'Structured Tutoring Plans', zh: '结构化科学辅导计划' },
  'packages.heading': { en: 'Structured Tutoring Plans', zh: '结构化科学辅导计划' },
  'packages.subtitle': {
    en: 'Single Session Tutoring • Book 1 session for targeted concepts or book 10 sessions with recurring options in all available dates. Change dates anytime in your Client Portal.',
    zh: '专属单课时辅导体系 • 可预约1次独立课时，或预约10次课时享受规律排课。学员中心支持随时自主改期。',
  },
  'packages.single.title': { en: 'Book 1 Session', zh: '预约 1 次课时' },
  'packages.single.subtitle': { en: '1 individual 60-min lesson • Ideal for targeted exam review, assessment prep, or single topic deep dive', zh: '1节专属60分钟课时 • 适合考前突击答疑、阶段测验或难点单项精讲' },
  'packages.10pack.title': { en: 'Book 10 Sessions', zh: '预约 10 次课时' },
  'packages.10pack.subtitle': { en: '10 lessons with recurring options in all available dates • Term foundation & sustained syllabus mastery', zh: '10节系统课时，支持在所有可用日期设置排课 • 学期基础夯实与大纲深度突破' },
  'packages.10pack.recurrenceBadge': { en: 'Recurring Options in All Available Dates', zh: '全可用日期灵活规律排课' },
  'packages.portalChangeNote': { en: 'Dates can be changed in your Client Portal anytime', zh: '可在学员中心随时自主调整授课日期' },
  'packages.recommended': { en: 'Recurring Cadence', zh: '规律学习推荐' },
  'packages.select': { en: 'Select Plan', zh: '选择此方案' },
  'packages.lessons': { en: 'Lessons', zh: '节课' },

  // How it works
  'how.title': { en: 'How Booking Works', zh: '预约流程' },
  'how.subtitle': { en: 'A streamlined, transparent booking process designed for busy families.', zh: '为忙碌学生与家长设计的简明、高效预约体验。' },
  'how.step1.title': { en: '1. Select Service & Plan', zh: '1. 选择科目与排课方案' },
  'how.step1.desc': { en: 'Choose Junior Science or HSC Chemistry/Biology, and choose to book 1 session or 10 sessions with recurring options.', zh: '根据年级挑选课程，选择预约1次课时或预约10次课时套餐。' },
  'how.step2.title': { en: '2. Pick Your Schedule', zh: '2. 选择上课时间节奏' },
  'how.step2.desc': { en: 'Book one-time, weekly, fortnightly, or custom pick across all available dates (7 days, 9am–9pm).', zh: '支持单次预约，或在所有可用日期设置每周、双周或完全自由自定义排课。' },
  'how.step3.title': { en: '3. Enter Details & Confirm', zh: '3. 填写基本联系信息' },
  'how.step3.desc': { en: 'Fill in student and contact details. Receive instant confirmation without upfront lock-in.', zh: '填写学员姓名及联系电话邮箱，系统即刻确认预约。' },
  'how.step4.title': { en: '4. Change Dates in Client Portal', zh: '4. 学员中心自由改期' },
  'how.step4.desc': { en: 'Log in anytime to view your upcoming lessons, change session dates, or adjust your schedule.', zh: '随时登录学员中心查看所有待上课程，支持一键自主改期与管理。' },

  // About
  'about.title': { en: 'Teaching Philosophy & Approach', zh: '关于 Shanon Lee Tutoring 的教学理念' },
  'about.p1': {
    en: 'At Shanon Lee Tutoring, we believe that academic excellence in science stems from curiosity and structured clarity. Every student brings a unique way of processing information; our job is to find the explanation that makes concepts click.',
    zh: '在 Shanon Lee Tutoring，我们坚信卓越的理科学术表现源于科学好奇心与清晰的思维结构。每位学生的理解方式各有不同，我们的核心任务就是找到最契合学生认知的阐释方式。',
  },
  'about.p2': {
    en: 'By pairing syllabus-aligned notes with active problem solving and supportive guidance, students develop self-reliance and genuine enthusiasm for science.',
    zh: '通过紧扣大纲的自研笔记、高强度的真题演练与耐心的启发式引导，帮助学生建立独立解题能力与深厚的学科兴趣。',
  },
  'about.contactCta': { en: 'Have a question? Email Shanon directly', zh: '有任何学业或排课疑问？欢迎直接发邮件联系' },

  // Booking Flow
  'booking.title': { en: 'Book Tutoring Sessions', zh: '在线预约辅导课时' },
  'booking.step1': { en: 'Service', zh: '选择课程' },
  'booking.step2': { en: 'Package', zh: '选择套餐' },
  'booking.step3': { en: 'Recurrence', zh: '排课周期' },
  'booking.step4': { en: 'Dates & Times', zh: '日期时间' },
  'booking.step5': { en: 'Student Info', zh: '学员信息' },
  'booking.step6': { en: 'Review', zh: '核对确认' },
  'booking.step7': { en: 'Success', zh: '预约成功' },

  'booking.recurrence.onetime': { en: 'One-Time', zh: '单次预约' },
  'booking.recurrence.onetime.desc': { en: 'Single isolated appointment on your chosen date', zh: '仅在所选日期进行单次授课' },
  'booking.recurrence.weekly': { en: 'Weekly', zh: '每周规律' },
  'booking.recurrence.weekly.desc': { en: 'Regular lessons repeating every 7 days', zh: '每隔7天在相同时段自动排课' },
  'booking.recurrence.fortnightly': { en: 'Fortnightly', zh: '双周规律' },
  'booking.recurrence.fortnightly.desc': { en: 'Steady lessons repeating every 14 days', zh: '每隔14天在相同时段排课' },
  'booking.recurrence.custom': { en: 'Custom Schedule', zh: '自由挑选时间' },
  'booking.recurrence.custom.desc': { en: 'Handpick the exact date and time for each individual lesson', zh: '每一节课由您分别指定具体日期与时段' },

  'booking.selectDate': { en: 'Select Date', zh: '选择授课日期' },
  'booking.selectTime': { en: 'Select Time Slot', zh: '选择授课时段' },
  'booking.noSlots': { en: 'No available slots on this date. Please pick another day.', zh: '该日期暂无可预约时段，请选择其他日期。' },
  'booking.blockedNotice': { en: 'This date is currently unavailable for bookings.', zh: '此日期已设为休息或不可预约。' },
  'booking.lessonsScheduled': { en: 'lessons scheduled', zh: '节课已安排' },
  'booking.of': { en: 'of', zh: '共' },
  'booking.conflict': { en: 'Scheduling Conflict', zh: '时间冲突' },
  'booking.adjustSlot': { en: 'Change this slot', zh: '调整此节课时间' },

  // Form Fields
  'form.fullName': { en: 'Student / Parent Full Name', zh: '学员/家长姓名' },
  'form.fullNamePlaceholder': { en: 'e.g. Jessica Chen', zh: '例如：王小明 / Jessica Chen' },
  'form.email': { en: 'Email Address', zh: '电子邮箱' },
  'form.emailPlaceholder': { en: 'e.g. jessica@example.com', zh: '用于接收预约凭证及学员中心登录' },
  'form.phone': { en: 'Contact Phone Number', zh: '联系电话' },
  'form.phonePlaceholder': { en: 'e.g. 0412 345 678', zh: '例如：0412 345 678' },
  'form.notes': { en: 'Learning Goals / Topics to Cover (Optional)', zh: '学习目标 / 重点辅导内容（选填）' },
  'form.notesPlaceholder': { en: 'e.g. Preparing for upcoming Year 11 Module 2 exam on Acid/Base reactions...', zh: '例如：目前正准备11年级Module 2酸碱平衡考试，希望重点讲解平衡常数计算...' },
  'form.required': { en: 'Required', zh: '必填' },

  // Buttons
  'btn.next': { en: 'Continue', zh: '下一步' },
  'btn.back': { en: 'Back', zh: '返回上一步' },
  'btn.confirmBooking': { en: 'Confirm Booking', zh: '确认并提交预约' },
  'btn.submitting': { en: 'Confirming Lessons...', zh: '正在提交预约...' },
  'btn.close': { en: 'Close', zh: '关闭' },
  'btn.viewPortal': { en: 'Go to Client Portal', zh: '前往学员中心' },
  'btn.bookAnother': { en: 'Book Another Lesson', zh: '预约其他课程' },

  // Success
  'success.title': { en: 'Booking Confirmed!', zh: '预约成功！' },
  'success.message': {
    en: 'Your science tutoring sessions have been successfully scheduled with Shanon Lee Tutoring.',
    zh: '您的辅导课时已成功录入系统，期待与您的精彩课程！',
  },
  'success.confirmationSent': {
    en: 'A confirmation reference has been recorded. You can log into the Client Portal anytime with your email to review or reschedule.',
    zh: '预约记录已生成。您可随时使用该邮箱登录学员中心，查看课表或申请改期。',
  },

  // Client Portal
  'portal.title': { en: 'Client Portal', zh: '学员中心' },
  'portal.welcome': { en: 'Welcome back', zh: '欢迎回来' },
  'portal.overview': { en: 'Overview', zh: '主览' },
  'portal.upcoming': { en: 'Upcoming Lessons', zh: '待上课程' },
  'portal.past': { en: 'Past Lessons', zh: '已完成课程' },
  'portal.cancelled': { en: 'Cancelled Lessons', zh: '已取消课程' },
  'portal.account': { en: 'Account Info', zh: '账户信息' },
  'portal.noUpcoming': { en: 'You have no upcoming lessons scheduled.', zh: '您目前没有待上的课程预约。' },
  'portal.noPast': { en: 'No past lessons recorded yet.', zh: '暂无历史授课记录。' },
  'portal.noCancelled': { en: 'No cancelled lessons.', zh: '暂无已取消的课程。' },
  'portal.reschedule': { en: 'Reschedule', zh: '申请改期' },
  'portal.cancel': { en: 'Cancel Lesson', zh: '取消预约' },
  'portal.status.pending': { en: 'Confirmed', zh: '已确认' },
  'portal.status.confirmed': { en: 'Confirmed', zh: '已确认' },
  'portal.status.completed': { en: 'Completed', zh: '已完成' },
  'portal.status.cancelled': { en: 'Cancelled', zh: '已取消' },
  'portal.cancelConfirm': { en: 'Are you sure you want to cancel this lesson?', zh: '您确定要取消这节辅导课吗？' },
  'portal.cancelWarning': { en: 'Once cancelled, your reserved time slot will become available to other students.', zh: '取消后，该时段将释放给其他同学预约。' },
  'portal.confirmCancelBtn': { en: 'Yes, Cancel Lesson', zh: '确认取消' },
  'portal.keepBtn': { en: 'Keep Lesson', zh: '保留课程' },
  'portal.rescheduleTitle': { en: 'Reschedule Lesson', zh: '调整授课时间' },
  'portal.rescheduleSuccess': { en: 'Lesson rescheduled successfully!', zh: '课程时间已成功更新！' },

  // Auth
  'auth.signIn': { en: 'Client Sign In', zh: '学员登录' },
  'auth.signUp': { en: 'Create Client Account', zh: '注册学员账户' },
  'auth.resetPassword': { en: 'Reset Password', zh: '找回密码' },
  'auth.adminSignIn': { en: 'Admin Sign In', zh: '管理员登录' },
  'auth.email': { en: 'Email', zh: '电子邮箱' },
  'auth.password': { en: 'Password', zh: '密码' },
  'auth.enterEmail': { en: 'Enter your email', zh: '输入您的邮箱' },
  'auth.enterPassword': { en: 'Enter your password', zh: '输入您的密码' },
  'auth.forgotPassword': { en: 'Forgot password?', zh: '忘记密码？' },
  'auth.sendResetLink': { en: 'Send Reset Link', zh: '发送重置链接' },
  'auth.noAccount': { en: "Don't have an account?", zh: '还没有账户？' },
  'auth.haveAccount': { en: 'Already have an account?', zh: '已有账户？' },
  'auth.signInBtn': { en: 'Sign In', zh: '登录' },
  'auth.signUpBtn': { en: 'Create Account', zh: '立即注册' },
  'auth.notAuthorizedAdmin': {
    en: 'You are signed in, but you are not authorized as an admin.',
    zh: '您已登录，但未被授权为管理员。',
  },

  // Admin Dashboard
  'admin.dashboard': { en: 'Admin Dashboard', zh: '管理控制台' },
  'admin.overview': { en: 'Overview', zh: '运营总览' },
  'admin.appointments': { en: 'Appointments', zh: '预约排课管理' },
  'admin.services': { en: 'Services', zh: '科目与课程设置' },
  'admin.businessHours': { en: 'Business Hours', zh: '营业与授课时间' },
  'admin.blockedDates': { en: 'Blocked Dates', zh: '休假日与屏蔽日期' },
  'admin.settings': { en: 'Business Settings', zh: '基本信息与规则' },
  'admin.searchPlaceholder': { en: 'Search by client name, email, or phone...', zh: '按学员姓名、邮箱或电话搜索...' },
  'admin.filterAll': { en: 'All Statuses', zh: '全部状态' },
  'admin.totalAppointments': { en: 'Total Bookings', zh: '累计预约' },
  'admin.todayAppointments': { en: "Today's Appointments", zh: '今日预约' },
  'admin.pendingRequests': { en: 'Pending Requests', zh: '待确认申请' },
  'admin.upcomingConfirmed': { en: 'Upcoming Confirmed', zh: '已确认近期课时' },
  'admin.completedAppointments': { en: 'Completed Lessons', zh: '已完成课时' },
  'admin.upcomingAppointments': { en: 'Upcoming Lessons', zh: '待上课时' },
  'admin.activeServices': { en: 'Active Services', zh: '开放科目' },
  'admin.saveChanges': { en: 'Save Changes', zh: '保存修改' },
  'admin.addService': { en: 'Add New Service', zh: '添加新科目' },
  'admin.editService': { en: 'Edit Service', zh: '编辑科目' },
  'admin.deleteService': { en: 'Delete Service', zh: '删除科目' },
  'admin.addBlockedDate': { en: 'Block a Date', zh: '新增屏蔽日期' },
  'admin.dateFilterAll': { en: 'All Dates', zh: '全部日期' },
  'admin.dateFilterToday': { en: 'Today', zh: '今日' },
  'admin.dateFilterUpcoming': { en: 'Upcoming', zh: '近期待上' },
  'admin.dateFilterPast': { en: 'Past', zh: '往期' },
  'admin.dateFilterCustom': { en: 'Filter by Date', zh: '按日期筛选' },
  'admin.clearDate': { en: 'Clear', zh: '清除' },
  'admin.statusPending': { en: 'Pending', zh: '待确认' },
  'admin.statusConfirmed': { en: 'Confirmed', zh: '已确认' },
  'admin.statusCompleted': { en: 'Completed', zh: '已完成' },
  'admin.statusCancelled': { en: 'Cancelled', zh: '已取消' },
  'admin.colClient': { en: 'Client', zh: '学员姓名' },
  'admin.colService': { en: 'Service', zh: '辅导科目' },
  'admin.colDateTime': { en: 'Date & Time', zh: '授课时间' },
  'admin.colContact': { en: 'Contact', zh: '联系方式' },
  'admin.colNotes': { en: 'Notes', zh: '备注' },
  'admin.colStatus': { en: 'Status', zh: '状态' },
  'admin.colActions': { en: 'Actions', zh: '操作' },
  'admin.scheduleLesson': { en: 'Schedule Lesson', zh: '手动排课' },
  'admin.exportCSV': { en: 'CSV', zh: '导出CSV' },
  'admin.confirmAppt': { en: 'Confirm', zh: '确认' },
  'admin.completeAppt': { en: 'Complete', zh: '完成' },
  'admin.cancelAppt': { en: 'Cancel', zh: '取消' },
  'admin.deleteConfirmTitle': { en: 'Delete Service', zh: '删除科目' },
  'admin.deleteConfirmWarning': {
    en: 'Are you sure you want to delete this service? If appointments are attached, please deactivate instead.',
    zh: '您确定要删除此科目吗？如果已有预约记录关联，建议将其停用而非删除。',
  },
  'admin.confirmDeleteService': { en: 'Delete Service', zh: '删除科目' },
  'admin.deleteServiceWarning': {
    en: 'Are you sure you want to delete this service? If appointments are attached, please deactivate instead.',
    zh: '您确定要删除此科目吗？如果已有预约记录关联，建议将其停用而非删除。',
  },
  'admin.saveAllHours': { en: 'Save All Working Hours', zh: '保存全部营业时间' },
  'admin.hoursSaved': { en: 'Working hours saved successfully!', zh: '营业时间已成功保存！' },
  'admin.needsReviewTitle': { en: 'Pending Review (Needs Tutor Confirmation)', zh: '待确认申请 (需老师确认)' },
  'admin.todayScheduleTitle': { en: "Today's Teaching Schedule", zh: '今日授课日程' },
  'admin.recentAppointmentsTitle': { en: 'Recent Appointments', zh: '近期预约记录' },
  'admin.noApptsToday': { en: 'No lessons scheduled for today.', zh: '今日暂无安排的授课。' },
  'admin.noPendingAppts': { en: 'No pending requests requiring review.', zh: '暂无需要审核的待确认申请。' },
  'admin.noFilteredAppts': { en: 'No appointments found matching your criteria.', zh: '未找到符合条件的预约记录。' },
  'admin.noBlockedDates': { en: 'No blocked dates configured.', zh: '未设置任何休假日。' },
  'admin.slotIntervalDesc': {
    en: 'Defines the step between booking options (e.g. 30 minutes gives 9:00, 9:30, 10:00).',
    zh: '定义预约时段的选择步长（例如30分钟将生成 9:00、9:30、10:00 等可选时段）。',
  },
  'admin.noticeHoursDesc': {
    en: 'Minimum lead time required before students can book a session.',
    zh: '学生最少须提前多少小时预约，防止临时突发预约。',
  },

  // Footer
  'footer.rights': { en: 'All rights reserved.', zh: '版权所有。' },
  'footer.contactUs': { en: 'Direct Inquiries', zh: '咨询与联系' },
  'footer.hours': { en: 'Available 7 Days • 9:00 AM – 9:00 PM', zh: '周一至周日开放 • 上午 9:00 至 晚上 9:00' },
  'footer.tagline': {
    en: 'Personalised secondary science mentoring for Year 7–10 foundations and Stage 6 HSC Chemistry & Biology.',
    zh: '为7–10年级夯实科学基础，为Stage 6 HSC化学与生物冲刺提供个性化指导。',
  },
  'footer.navigation': { en: 'Navigation', zh: '快速导航' },
  'footer.curriculumAligned': {
    en: 'NSW Curriculum Aligned • English & 简体中文 Available',
    zh: '严格契合NSW教学大纲 • 支持中英文双语',
  },

  // Theme
  'theme.preference': { en: 'Theme Preference', zh: '界面主题外观' },
  'theme.light': { en: 'Light', zh: '浅色' },
  'theme.dark': { en: 'Dark', zh: '深色' },
  'theme.system': { en: 'System', zh: '跟随系统' },
  'theme.auto': { en: 'Auto', zh: '自动' },

  // Hero & Brand extras
  'hero.operatingDays': { en: '7 Days', zh: '7天开放' },
  'hero.tagline': { en: 'Science & HSC', zh: '科学与HSC学科辅导' },

  // Services Extras
  'services.targetedHeading': { en: 'Targeted Scientific Instruction', zh: '精准匹配新州大纲的理科私教' },
  'services.empty': { en: 'No tutoring services currently available.', zh: '当前暂无可预约科目。' },
  'services.defaultDesc': {
    en: "Personalised one-to-one science tutoring tailored to the student's learning goals.",
    zh: '根据学生学业目标度身定制的1对1科学教学。',
  },
  'services.perSession': { en: 'AUD / session', zh: '澳元 / 课时' },
  'services.j1': { en: 'Comprehensive Stage 4 & 5 Core Strands', zh: '全面覆盖Stage 4与5四大核心领域' },
  'services.j2': { en: 'Working Scientifically & Inquiry Skills', zh: '培养科学探究与实验分析思维' },
  'services.j3': { en: 'Early Preparation for Stage 6 Science', zh: '为高年级HSC理科选课奠定坚实基础' },
  'services.h1': { en: 'HSC Chemistry Modules 1–8 Deep Dive', zh: 'HSC化学 Modules 1–8 深度精讲' },
  'services.h2': { en: 'HSC Biology Modules 1–8 Syllabus Coverage', zh: 'HSC生物 Modules 1–8 全考点剖析' },
  'services.h3': { en: 'Past Paper Analysis & Extended Response Technique', zh: '真题深度拆解与高分长答题技巧' },

  // Junior & HSC Deep Dive Extras
  'curriculum.foundationsTag': { en: 'NSW Science Foundations', zh: '新州科学核心素养' },
  'curriculum.juniorYears': { en: 'Years 7, 8, 9 & 10 Science', zh: '7至10年级综合科学' },
  'curriculum.coreFoundations': { en: 'Core Foundations', zh: '核心基础' },
  'curriculum.juniorBookBtn': { en: 'Schedule Junior Science Lesson', zh: '预约初中科学课程' },
  'curriculum.hscTag': { en: 'Stage 6 HSC Preparation', zh: 'Stage 6 HSC应考冲刺' },
  'curriculum.hscBookBtn': { en: 'Schedule HSC Science Lesson', zh: '预约HSC科学课程' },
  'curriculum.chemTitle': { en: 'HSC Chemistry', zh: 'HSC 化学' },
  'curriculum.chemSub': { en: 'Equilibrium & Organic', zh: '平衡反应与有机化学' },
  'curriculum.bioTitle': { en: 'HSC Biology', zh: 'HSC 生物' },
  'curriculum.bioSub': { en: 'Genetics & Disease', zh: '遗传密码与疾病机理' },

  // Packages Extras
  'packages.recurringCadence': { en: 'Recurring Cadence', zh: '规律学习排课' },
  'packages.oneTimeSession': { en: 'One-Time Session', zh: '单次课时' },
  'packages.audEst': { en: 'AUD est.', zh: '澳元预估' },
  'packages.perLesson': { en: 'per 60-min lesson', zh: '每60分钟课时' },
  'packages.lessonsUnit': { en: '60-min 1-on-1 private lessons', zh: '节 60分钟一对一私教课' },
  'packages.10packHighlight': {
    en: 'Recurring options in all available dates (Weekly, Fortnightly, or Custom)',
    zh: '支持在所有可用日期设置排课（每周、双周或自由挑选）',
  },
  'packages.singleHighlight': {
    en: 'Targeted single assessment & exam topic deep dive',
    zh: '针对性单项评估与难点考点深度攻坚',
  },
  'packages.sevenDaysAvailability': {
    en: '7 Days a week availability (9:00 AM – 9:00 PM)',
    zh: '每周7天均可排课（上午9:00至晚上9:00）',
  },
  'packages.changePortalAnytime': {
    en: 'Change dates anytime in your Client Portal',
    zh: '可在学员中心随时自主调整授课日期',
  },
  'packages.book10Btn': { en: 'Book 10 Sessions', zh: '预约10次课时' },
  'packages.book1Btn': { en: 'Book 1 Session', zh: '预约1次课时' },
  'packages.flexibilityTitle': { en: 'Full Schedule Flexibility', zh: '高度自主的排课灵活性' },
  'packages.flexibilityHeading': {
    en: 'Need to reschedule or adjust a date later?',
    zh: '后续需要调整或重新安排上课时间？',
  },
  'packages.flexibilityDesc': {
    en: 'All bookings include full access to your student Client Portal. You can easily change dates, update time slots, or view your upcoming schedule anytime without administrative hassle.',
    zh: '所有预约均包含学员中心完整权限。您可以随时登录自主更改上课日期、调整时段或查看待上课表，省心高效。',
  },
  'packages.portalIncludedBadge': { en: 'Client Portal Included', zh: '附赠学员中心自主管理' },

  // About Extras
  'about.scheduleTitle': { en: 'Teaching Schedule', zh: '授课时间' },
  'about.scheduleHours': { en: '7 Days • 9:00 AM – 9:00 PM', zh: '周一至周日 • 上午 9:00 – 晚上 9:00' },
  'about.approachTag': { en: 'Teaching Approach', zh: '教学方法' },
  'about.inquiries': { en: 'Direct Questions or Inquiries', zh: '学业咨询与沟通' },

  // How it works Extras
  'how.transparentHeading': { en: 'Simple, Transparent Scheduling', zh: '简明高效的预约流程' },
  'how.stepIndicator': { en: 'Step {n} of 4', zh: '步骤 {n} / 共 4 步' },

  // Booking Flow Extras
  'booking.step2Subtitle': {
    en: 'Single Session Tutoring • Choose 1 lesson or book 10 sessions with recurring scheduling options.',
    zh: '专属单课时辅导体系 • 可预约1次独立课时，或预约10次课时享受规律排课选项。',
  },
  'booking.choosePackage': { en: 'Choose Session Package', zh: '选择辅导课时方案' },
  'booking.recurringAllDates': { en: 'Recurring in All Available Dates', zh: '全可用日期灵活规律排课' },
  'booking.flexibleDates': { en: 'Flexible Dates', zh: '自主灵活' },
  'booking.portalGuarantee': { en: 'Client Portal Guarantee:', zh: '学员中心自主管理保障：' },
  'booking.portalGuaranteeDesc': {
    en: 'You can change dates and times for any booked session anytime in your Client Portal.',
    zh: '您可以在学员中心随时自主修改任何已预约课时的日期与时间。',
  },
  'booking.step3Cadence': { en: 'Choose Learning Cadence', zh: '选择排课周期与节奏' },
  'booking.every7Days': { en: 'Every 7 Days', zh: '每隔7天' },
  'booking.every14Days': { en: 'Every 14 Days', zh: '每隔14天' },
  'booking.recommendedBadge': { en: 'Recommended', zh: '推荐' },
  'booking.step4Times': { en: 'Schedule Your Lesson Times', zh: '安排您的各节授课时段' },
  'booking.operatingNotice': { en: 'Operating 7 Days • 9:00 AM – 9:00 PM', zh: '周一至周日开放 • 上午 9:00 – 晚上 9:00' },
  'booking.scheduledCount': { en: 'Scheduled', zh: '已安排' },
  'booking.lessonLabel': { en: 'Lesson', zh: '第' },
  'booking.lessonSuffix': { en: '', zh: '节' },
  'booking.configuringLesson': { en: 'Configuring Lesson {cur} of {total}', zh: '正在配置第 {cur} / 共 {total} 节课' },
  'booking.duration': { en: 'Duration:', zh: '课时时长：' },
  'booking.allScheduledSessions': { en: 'All Scheduled Sessions', zh: '全部已安排课时一览' },
  'booking.changePortalTip': { en: 'Change dates anytime in Client Portal', zh: '学员中心随时支持自主改期' },
  'booking.pickSlot': { en: 'Pick slot', zh: '待选时段' },
  'booking.step5Contact': { en: 'Student & Contact Information', zh: '学员与联系人信息' },
  'booking.step6Review': { en: 'Review Your Tutoring Booking', zh: '核对您的预约信息' },
  'booking.reviewService': { en: 'Tutoring Service:', zh: '所选辅导科目：' },
  'booking.reviewPackage': { en: 'Package:', zh: '所选套餐：' },
  'booking.reviewCadence': { en: 'Cadence:', zh: '排课节奏：' },
  'booking.reviewScheduledLessons': { en: 'Scheduled Lessons:', zh: '已选课时明细：' },
  'booking.reviewStudentContact': { en: 'Student Contact:', zh: '学员联系方式：' },
  'booking.reviewNotificationEmail': { en: 'Notification Email:', zh: '通知邮箱：' },
  'booking.reviewPricing': { en: 'Pricing:', zh: '费用预估：' },
  'booking.reviewEstimated': { en: 'AUD estimated', zh: '澳元预估' },
  'booking.reviewChangeAnytime': {
    en: 'You can change or reschedule any of these lesson dates in your Client Portal anytime.',
    zh: '您后续可在学员中心随时调整或重新安排其中任何一节课的时间。',
  },
  'booking.successSubject': { en: 'Subject:', zh: '预约科目：' },
  'booking.successStudent': { en: 'Student:', zh: '学员姓名：' },
  'booking.successEmail': { en: 'Email:', zh: '联系邮箱：' },
  'booking.successConfirmedSessions': { en: 'Confirmed Sessions:', zh: '已确认授课时段：' },
  'booking.errorResolveConflicts': {
    en: 'Please resolve all schedule conflicts before proceeding.',
    zh: '请在进入下一步前解决所有时间冲突。',
  },
  'booking.errorFillRequired': {
    en: 'Please fill in required student name, email, and phone number.',
    zh: '请填写学员姓名、电子邮箱及联系电话。',
  },

  // Client Portal Extras
  'portal.returnToSite': { en: 'Return to Website', zh: '返回首页' },
  'portal.loading': { en: 'Loading your tutoring schedule...', zh: '正在加载您的课表...' },
  'portal.notesLabel': { en: 'Notes:', zh: '备注：' },
  'portal.originalDate': { en: 'Original date:', zh: '原定时间：' },
  'portal.registeredEmail': { en: 'Registered Email:', zh: '注册邮箱：' },
  'portal.userId': { en: 'User ID:', zh: '用户ID：' },
  'portal.accountCreated': { en: 'Account Created:', zh: '注册日期：' },
  'portal.modalDate': { en: 'Date:', zh: '授课日期：' },
  'portal.modalTime': { en: 'Time:', zh: '授课时段：' },
  'portal.cancelling': { en: 'Cancelling...', zh: '取消中...' },
  'portal.newDate': { en: 'New Date', zh: '更改后的日期' },
  'portal.availableSlots': { en: 'Available Time Slots', zh: '可选时段' },
  'portal.noSlotsOnDate': { en: 'No slots available on this date.', zh: '该日期暂无可排时段。' },
  'portal.saving': { en: 'Saving...', zh: '保存中...' },
  'portal.confirmNewTime': { en: 'Confirm New Time', zh: '确认更改时段' },

  // Auth Extras
  'auth.processing': { en: 'Processing...', zh: '处理中...' },
  'auth.backToSignIn': { en: 'Back to Sign In', zh: '返回登录' },
  'auth.errorEmail': { en: 'Please enter your email address.', zh: '请输入您的电子邮箱。' },
  'auth.errorPassword': { en: 'Please enter your password.', zh: '请输入您的密码。' },
  'auth.accountCreated': {
    en: 'Account created! Please check your email inbox to confirm your address before signing in.',
    zh: '账户创建成功！请查收验证邮件以激活账户并登录。',
  },
  'auth.resetSent': {
    en: 'Password reset instructions have been dispatched to your email.',
    zh: '密码重置邮件已发送至您的邮箱，请按指引操作。',
  },

  // Conflict reasons
  'conflict.selectDateAndTime': { en: 'Date and start time must be selected', zh: '必须选择上课日期和开始时间' },
  'conflict.blocked': { en: 'This date is blocked for tutoring', zh: '该日期已设为休息不可排课' },
  'conflict.closed': { en: 'Tutoring is closed on this day', zh: '该日期不开放授课' },
  'conflict.notice': { en: 'Requires advance notice', zh: '需提前预约' },
  'conflict.overlapExisting': { en: 'Time slot overlaps with an existing confirmed appointment', zh: '该时段与已确认的既有课程冲突' },
  'conflict.overlapBasket': { en: 'Conflicts with another lesson in your current schedule', zh: '与您当前排课中的另一节课冲突' },

  // Additional section keys
  'hero.overlayTitle': { en: 'NSW Science Syllabus', zh: 'NSW 新州科学大纲' },
  'hero.overlaySubtitle': { en: 'Stage 4, 5 & Stage 6 (HSC)', zh: 'Stage 4, 5 及 Stage 6 (HSC)' },
  'curriculum.stage45': { en: 'NSW Stage 4 & 5', zh: 'NSW 阶段 4 & 5 (Stage 4 & 5)' },
  'why.methodologyTag': { en: 'Educational Methodology', zh: '教学理念与方法' },
  'why.mentorshipTitle': { en: 'Tailored Mentorship', zh: '专属针对性辅导' },
  'why.mentorshipDesc': {
    en: 'Personalised pacing ensures students ask the questions they might hesitate to ask in a 30-person classroom.',
    zh: '个性化节奏让学生敢于随时提问，击破在大班教学中容易遗漏的盲点。',
  },
  'booking.step1SelectSubject': { en: 'Select Tutoring Subject', zh: '选择辅导科目' },
  'booking.total': { en: 'Total:', zh: '总计：' },
  'portal.errorSelectSlot': { en: 'Please select an available date and time slot.', zh: '请选择可用的日期与时段。' },
  'nav.themeLabel': { en: 'Theme / 浅深色模式', zh: '外观主题 / Theme' },
};

export function getTranslation(key: string, lang: Language): string {
  const item = (translations as any)[key];
  if (!item) return key;
  return item[lang] || item['en'] || key;
}
