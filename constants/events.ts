export interface ScheduleItem {
  time: string;
  title: string;
  location?: string;
}

export interface DaySchedule {
  day: string;
  date: string;
  events: ScheduleItem[];
}

export const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: 'Day 01',
    date: 'July 25',
    events: [
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess' },
      { time: '9:30 AM - 10:45 AM', title: 'Registrations', location: 'Respective Institutes' },
      { time: '11:00 AM - 12:30 PM', title: 'Inaugural Ceremony', location: 'IM Amphi (Webcast in IET Amphi)' },
      { time: '12:30 PM - 1:00 PM', title: 'Aarambh Schedule & Aarambh rules and regulations BY Mr. Deepak Sogani', location: 'IM Amphi (Webcast in IET)' },
      { time: '1:00 PM - 2:30 PM', title: 'LUNCH', location: 'Students Mess' },
      { time: '2:30 PM - 5:00 PM', title: 'Ice Breaking Session by Manish Freeman and Chetan Kanoongo', location: '006 & 001 Design Studio (Tech Block)' },
      { time: '5:00 PM - 6:00 PM', title: 'SNACKS', location: 'Students Mess' },
      { time: '6:00 PM - 8:00 PM', title: 'JKLU Explorer Challenge by Manish Freeman and Chetan Kanoongo' },
      { time: '8:00 PM - 9:30 PM', title: 'DINNER', location: 'Students Mess' },
      { time: '9:30 PM - 11:00 PM', title: 'Kingdom Game Night & Circle time by Manish Freeman and Chetan Kanoongo' },
      { time: '11:00 PM - 11:30 PM', title: 'Introduction Of Team Aarambh', location: 'IM Amphi' }
    ]
  },
  {
    day: 'Day 02',
    date: 'July 26',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities' },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess' },
      { time: '9:30 AM - 10:30 AM', title: 'Introduction of UnConference by Manish Freeman and Chetan Kanoongo', location: 'Sabrang Ground' },
      { time: '10:30 AM - 1:00 PM', title: 'Youth UnConference by Manish Freeman and Chetan', location: 'Sabrang Ground' },
      { time: '1:00 PM - 2:30 PM', title: 'LUNCH', location: 'Students Mess' },
      { time: '2:30 PM - 5:30 PM', title: 'Strategic Thinking Workshop by Student Coordinators', location: 'IET Amphi & IM Amphi' },
      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess' },
      { time: '6:30 PM - 9:00 PM', title: 'Express Yourself', location: 'Tech Lawn' },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess' },
      { time: '10:30 PM - 11:30 PM', title: 'Dumb Drama By Student Coordinator', location: 'IM Amphi' }
    ]
  },
  {
    day: 'Day 03',
    date: 'July 27',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities' },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess' },
      { time: '9:30 AM - 10:15 AM', title: 'Mental Health', location: 'IM Amphitheatre' },
      { time: '9:30 AM - 10:15 AM', title: 'Placement', location: 'IET Amphitheatre' },
      { time: '10:15 AM - 11:00 AM', title: 'Mental Health', location: 'IET Amphitheatre' },
      { time: '10:15 AM - 11:00 AM', title: 'Placement', location: 'IM Amphitheatre' },
      { time: '11:00 AM - 1:30 PM', title: 'Workshop on Start Strong: Creating a Safe Space Through POSH Awareness by Anjali Suneja', location: 'IM Amphi' },
      { time: '11:00 AM - 1:30 PM', title: 'Mind Hacks: The Hidden Psychology Behind Every Decision Workshop by Manan Pahwa', location: 'IET Amphi' },
      { time: '1:30 PM - 3:00 PM', title: 'LUNCH', location: 'Students Mess' },
      { time: '3:00 PM - 5:30 PM', title: 'Workshop on Start Strong: Creating a Safe Space Through POSH Awareness by Anjali Suneja', location: 'IET Amphi' },
      { time: '3:00 PM - 5:30 PM', title: 'Mind Hacks: The Hidden Psychology Behind Every Decision Workshop by Manan Pahwa', location: 'IM Amphi' },
      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess' },
      { time: '6:30 PM - 9:00 PM', title: 'Brush & Bond by Student Coordinators', location: 'Tech Lawn' },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess' },
      { time: '10:30 PM - 11:30 PM', title: 'DanceVerse By Steppers Squad', location: 'IM Amphi' }
    ]
  },
  {
    day: 'Day 04',
    date: 'July 28',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities' },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess' },
      { time: '9:30 AM - 10:00 AM', title: 'Examination Cell', location: 'IM Amphi' },
      { time: '9:30 AM - 10:00 AM', title: 'Student Affairs', location: 'IET Amphi' },
      { time: '10:00 AM - 10:30 AM', title: 'Examination Cell', location: 'IET Amphi' },
      { time: '10:00 AM - 10:30 AM', title: 'Student Affairs', location: 'IM Amphi' },
      { time: '10:30 AM - 10:45 AM', title: 'IT', location: 'IM Amphi' },
      { time: '10:30 AM - 10:45 AM', title: 'LRC/Accounts', location: 'IET Amphi' },
      { time: '10:45 AM - 11:00 AM', title: 'IT', location: 'IET Amphi' },
      { time: '10:45 AM - 11:00 AM', title: 'LRC/Accounts', location: 'IM Amphi' },
      { time: '11:00 AM - 1:30 PM', title: 'Workshop on Pause. Reflect. Reconnect: A Guide to Digital Well-being', location: 'IM Amphi' },
      { time: '11:00 AM - 1:30 PM', title: 'Pottery Session by Kunal Agarwal', location: '006 & 001 Design Studio (Tech Block)' },
      { time: '1:30 PM - 3:00 PM', title: 'LUNCH', location: 'Students Mess' },
      { time: '3:00 PM - 5:30 PM', title: 'Workshop on Pause. Reflect. Reconnect: A Guide to Digital Well-being', location: 'IET Amphi' },
      { time: '3:00 PM - 5:30 PM', title: 'Pottery Session by Kunal Agarwal', location: '006 & 001 Design Studio (Tech Block)' },
      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess' },
      { time: '6:30 PM - 9:00 PM', title: 'Armaan & Band', location: 'Tech Lawn' },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess' },
      { time: '10:30 PM - 11:30 PM', title: 'Brief about Outing', location: 'IM Amphi' }
    ]
  },
  {
    day: 'Day 05',
    date: 'July 29',
    events: [
      { time: 'All Day', title: 'Outing Day', location: 'Off Campus' }
    ]
  },
  {
    day: 'Day 06',
    date: 'July 30',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities' },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess' },
      { time: '9:30 AM - 12:00 PM', title: 'Workshop on GOAL setting by CCCT Team', location: 'IM & IET Amphitheatre' },
      { time: '12:00 PM - 1:30 PM', title: 'Dare to Run Session by Amit Sheth', location: 'IM Amphi' },
      { time: '12:00 PM - 1:30 PM', title: 'Art of Living', location: 'IET Amphi' },
      { time: '1:30 PM - 3:00 PM', title: 'LUNCH', location: 'Students Mess' },
      { time: '3:00 PM - 4:30 PM', title: 'Dare to Run Session by Amit Sheth', location: 'IET Amphi' },
      { time: '3:00 PM - 4:30 PM', title: 'Art of Living', location: 'IM Amphi' },
      { time: '4:30 PM - 5:30 PM', title: 'Session by AIC', location: 'IM & IET Amphi' },
      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess' },
      { time: '6:30 PM - 9:00 PM', title: 'JKLU Got Latent', location: 'IM Amphi' },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess' },
      { time: '10:30 PM - 11:30 PM', title: 'Movie Night', location: 'New Tech Block (001, 006)' }
    ]
  },
  {
    day: 'Day 07',
    date: 'July 31',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities' },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess' },
      { time: '9:30 AM - 11:00 AM', title: 'In search of a good life Session by Amit Sheth', location: 'IM Amphi' },
      { time: '9:30 AM - 11:00 AM', title: 'Workshop on Cyber Security by Mukesh Choudhary', location: 'IET Amphi' },
      { time: '11:00 AM - 12:30 PM', title: 'In search of a good life Session by Amit Sheth', location: 'IET Amphi' },
      { time: '11:00 AM - 12:30 PM', title: 'Workshop on Cyber Security by Mukesh Choudhary', location: 'IM Amphi' },
      { time: '12:30 PM - 2:00 PM', title: 'LUNCH', location: 'Students Mess' },
      { time: '2:00 PM - 2:30 PM', title: 'Hostel/Anti-Ragging', location: 'IM Amphitheatre' },
      { time: '2:00 PM - 2:30 PM', title: 'Administration', location: 'IET Amphitheatre' },
      { time: '2:30 PM - 3:00 PM', title: 'Hostel/Anti-Ragging', location: 'IET Amphitheatre' },
      { time: '2:30 PM - 3:00 PM', title: 'Administration', location: 'IM Amphitheatre' },
      { time: '3:00 PM - 5:30 PM', title: '“Know Your Institute” – Students visit their respective institutes' },
      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', location: 'Students Mess' },
      { time: '6:30 PM - 9:00 PM', title: 'Sports Activity (Cohort Wise Matches)', location: 'Respective Grounds' },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', location: 'Students Mess' },
      { time: '10:30 PM - 11:30 PM', title: 'Stories Framed', location: 'IM Amphi' }
    ]
  },
  {
    day: 'Day 08',
    date: 'August 01',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'REST' },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', location: 'Students Mess' },
      { time: '9:30 AM - 1:00 PM', title: 'Workshop by Manzil Mystics', location: 'IM & IET Amphitheatre' },
      { time: '1:00 PM - 2:30 PM', title: 'LUNCH', location: 'Students Mess' },
      { time: '2:30 PM - 4:00 PM', title: 'Visit of Music Bus by Manzil Mystics' },
      { time: '4:00 PM - 6:30 PM', title: 'Performance of Manzil Mystics followed by Closing Ceremony', location: 'LRC Stairs' },
      { time: '6:30 PM', title: 'Departure of Buses', location: 'JKLU Main Gate' }
    ]
  }
];
