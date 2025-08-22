import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ctiewkuervrxlajpjaaz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWV3a3VlcnZyeGxhanBqYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTQxNjQsImV4cCI6MjA3MTEzMDE2NH0.av5CL8gcxL79C2zCxMSi4icCTAA6de2Cu81g5M7tzRo'
);

async function insertSampleContent() {
  console.log('Inserting sample content...');
  
  const sampleArticles = [
    {
      topic: 'feeding_nutrition',
      age_range: 'all',
      title: 'Feeding Your Newborn: Tips for New Parents',
      url: 'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/healthy-baby/art-20047741',
      content_summary: 'Use breast milk or formula, feed on cue every 2-3 hours, look for early hunger signs, and trust the baby\'s instincts, not the amount.',
      source_domain: 'mayoclinic.org',
      publication_date: '2024-01-15',
      quality_score: 0.9,
      refresh_cycle: 1,
      is_active: true,
      image_url: 'https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2013/08/26/10/52/my00926_im03836_mcdc7_feeding_newbornthu_jpg.jpg',
      reading_time: 5,
      author: 'Mayo Clinic Staff',
      tags: ['feeding', 'newborn']
    },
    {
      topic: 'feeding_nutrition',
      age_range: 'all',
      title: 'Starting Solid Foods',
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
      content_summary: 'It is important for your baby to get used to the process of eating—sitting up, taking food from a spoon, resting between bites and stopping when full.',
      source_domain: 'healthychildren.org',
      publication_date: '2024-01-10',
      quality_score: 0.85,
      refresh_cycle: 1,
      is_active: true,
      image_url: null,
      reading_time: 4,
      author: 'AAP',
      tags: ['feeding', 'solid foods']
    },
    {
      topic: 'sleep_patterns',
      age_range: 'all',
      title: 'Baby Sleep Training: Methods and Tips',
      url: 'https://www.sleepfoundation.org/baby-sleep/baby-sleep-training',
      content_summary: 'Learn about different sleep training methods including graduated extinction, bedtime fading, and pick up/put down techniques for better baby sleep.',
      source_domain: 'sleepfoundation.org',
      publication_date: '2024-01-12',
      quality_score: 0.88,
      refresh_cycle: 1,
      is_active: true,
      image_url: null,
      reading_time: 6,
      author: 'Sleep Foundation',
      tags: ['sleep', 'training']
    },
    {
      topic: 'cognitive_development',
      age_range: 'all',
      title: 'Your Baby\'s Brain Development',
      url: 'https://zerotothree.org/resource/brain-development/',
      content_summary: 'The first three years of a child\'s life are critical for brain development. During this time, the brain forms more than 1 million neural connections every second.',
      source_domain: 'zerotothree.org',
      publication_date: '2024-01-08',
      quality_score: 0.92,
      refresh_cycle: 1,
      is_active: true,
      image_url: null,
      reading_time: 7,
      author: 'Zero to Three',
      tags: ['brain', 'development']
    }
  ];

  const { data, error } = await supabase
    .from('topic_content')
    .insert(sampleArticles);

  if (error) {
    console.error('Error inserting content:', error);
  } else {
    console.log('Successfully inserted sample content!');
    console.log('Inserted articles:', sampleArticles.length);
  }

  // Check what was inserted
  const { data: check, error: checkError } = await supabase
    .from('topic_content')
    .select('topic, title, quality_score')
    .eq('is_active', true);

  if (checkError) {
    console.error('Error checking content:', checkError);
  } else {
    console.log('Current content in database:', check);
  }
}

insertSampleContent();