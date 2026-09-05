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
  'services.subtitle': {
    en: 'Targeted scientific instruction calibrated to the NSW syllabus and individual student pace.',
    zh: '严格对照新南威尔士州教学大纲（NSW Syllabus），因材施教。',
  },
  'services.duration': { en: 'Duration', zh: '课时' },
  'services.minutes': { en: 'minutes', zh: '分钟' },
  'services.pricePending': { en: 'Price subject to change', zh: '课时费待定（请咨询）' },
  'services.bookBtn': { en: 'Book This Lesson', zh: '预约此课程' },
  'services.juniorBadge': { en: 'Years 7–10 Foundations', zh: '7–10年级 科学通识基础' },
  'services.hscBadge': { en: 'Years 11–12 HSC Mastery', zh: '11–12年级 HSC高阶提分' },

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
  'packages.title': { en: 'Structured Tutoring Plans', zh: '结构化辅导计划' },
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
  'admin.searchPlaceholder': { en: 'Search by client name or email...', zh: '按学员姓名或邮箱搜索...' },
  'admin.filterAll': { en: 'All Statuses', zh: '全部状态' },
  'admin.totalAppointments': { en: 'Total Bookings', zh: '累计预约' },
  'admin.upcomingAppointments': { en: 'Upcoming Lessons', zh: '待上课时' },
  'admin.activeServices': { en: 'Active Services', zh: '开放科目' },
  'admin.saveChanges': { en: 'Save Changes', zh: '保存修改' },
  'admin.addService': { en: 'Add New Service', zh: '添加新科目' },
  'admin.editService': { en: 'Edit Service', zh: '编辑科目' },
  'admin.addBlockedDate': { en: 'Block a Date', zh: '新增屏蔽日期' },

  // Footer
  'footer.rights': { en: 'All rights reserved.', zh: '版权所有。' },
  'footer.contactUs': { en: 'Direct Inquiries', zh: '咨询与联系' },
  'footer.hours': { en: 'Available 7 Days • 9:00 AM – 9:00 PM', zh: '周一至周日开放 • 上午 9:00 至 晚上 9:00' },
};

export function getTranslation(key: string, lang: Language): string {
  const item = (translations as any)[key];
  if (!item) return key;
  return item[lang] || item['en'] || key;
}
