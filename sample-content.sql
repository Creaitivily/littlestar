-- Sample content for testing the AnyCrawl integration
-- Run this in Supabase SQL Editor to add test articles

INSERT INTO topic_content (
  topic, age_range, title, url, content_summary, source_domain, 
  publication_date, quality_score, refresh_cycle, is_active
) VALUES 
-- Feeding & Nutrition articles
('feeding_nutrition', '0-1_months', 
 'Breastfeeding Basics: Getting Started Right',
 'https://healthychildren.org/breastfeeding-basics',
 'Essential guide for new mothers on establishing successful breastfeeding, including proper latch techniques and feeding schedules.',
 'healthychildren.org', '2024-08-20', 0.95, 1, true),

('feeding_nutrition', '6-7_months', 
 'First Foods: Safe Introduction to Solids',
 'https://mayoclinic.org/first-foods-guide',
 'When and how to introduce solid foods, including allergen introduction guidelines and portion sizes for 6-month-olds.',
 'mayoclinic.org', '2024-08-18', 0.92, 1, true),

-- Sleep articles
('sleep_patterns', '0-1_months',
 'Newborn Sleep Patterns: What to Expect', 
 'https://sleepfoundation.org/newborn-sleep',
 'Understanding your newborn''s sleep cycles, safe sleep practices, and creating optimal sleep environment.',
 'sleepfoundation.org', '2024-08-15', 0.88, 1, true),

('sleep_patterns', '3-4_months',
 'The 4-Month Sleep Regression: Survival Guide', 
 'https://healthychildren.org/sleep-regression',
 'Why sleep regression happens at 4 months and evidence-based strategies to help your baby sleep better.',
 'healthychildren.org', '2024-08-12', 0.85, 1, true),

-- Cognitive Development
('cognitive_development', '0-1_months',
 'Your Baby''s Developing Brain: 0-1 Month',
 'https://zerotothree.org/newborn-brain',
 'How your newborn''s brain develops in the first month and activities to support cognitive growth.',
 'zerotothree.org', '2024-08-10', 0.9, 1, true),

('cognitive_development', '6-7_months',
 'Cognitive Milestones at 6 Months',
 'https://cdc.gov/cognitive-6-months',
 'Important cognitive milestones including object permanence, cause-and-effect understanding, and memory development.',
 'cdc.gov', '2024-08-08', 0.93, 1, true),

-- Physical Development
('physical_development', '3-4_months',
 'Tummy Time: Building Strong Muscles',
 'https://aap.org/tummy-time-guide',
 'The importance of tummy time for motor development and techniques to make it enjoyable for your baby.',
 'aap.org', '2024-08-14', 0.91, 1, true),

('physical_development', '9-10_months',
 'Crawling to Walking: Movement Milestones',
 'https://healthychildren.org/movement-milestones',
 'Physical development from crawling to first steps, and how to encourage safe exploration.',
 'healthychildren.org', '2024-08-05', 0.87, 1, true),

-- Health & Safety
('health_safety', '0-1_months',
 'Essential Newborn Health Checks',
 'https://mayoclinic.org/newborn-health',
 'Understanding newborn screening tests, vaccination schedule, and when to call the doctor.',
 'mayoclinic.org', '2024-08-22', 0.94, 1, true),

('health_safety', '12-18_months',
 'Childproofing for Toddlers',
 'https://cdc.gov/toddler-safety',
 'Creating a safe environment as your toddler becomes more mobile and curious.',
 'cdc.gov', '2024-08-07', 0.86, 1, true),

-- Activities & Play
('activities_play', '3-4_months',
 'Sensory Play for 3-4 Month Olds',
 'https://zerotothree.org/sensory-play',
 'Age-appropriate sensory activities to stimulate development and bonding.',
 'zerotothree.org', '2024-08-16', 0.88, 1, true),

('activities_play', '6-7_months',
 'Interactive Games for 6-Month-Olds',
 'https://healthychildren.org/play-ideas',
 'Fun, developmental games to play with your 6-month-old to boost learning and connection.',
 'healthychildren.org', '2024-08-09', 0.85, 1, true),

-- Language & Communication
('language_communication', '0-1_months',
 'First Communications: Understanding Baby Cues',
 'https://asha.org/baby-communication',
 'Decoding your newborn''s cries, facial expressions, and body language.',
 'asha.org', '2024-08-19', 0.89, 1, true),

('language_communication', '9-10_months',
 'From Babbling to First Words',
 'https://asha.org/first-words',
 'Language development milestones and activities to encourage speech development.',
 'asha.org', '2024-08-11', 0.91, 1, true),

-- Social & Emotional
('social_emotional', '0-1_months',
 'Building Secure Attachment from Day One',
 'https://zerotothree.org/attachment',
 'The importance of bonding and responsive caregiving for emotional development.',
 'zerotothree.org', '2024-08-21', 0.92, 1, true),

('social_emotional', '6-7_months',
 'Social Smiles and Stranger Anxiety',
 'https://healthychildren.org/social-development',
 'Understanding your baby''s social development and emotional milestones at 6 months.',
 'healthychildren.org', '2024-08-06', 0.84, 1, true),

-- Behavior & Discipline
('behavior_discipline', '12-18_months',
 'Positive Discipline for Toddlers',
 'https://aap.org/positive-discipline',
 'Age-appropriate discipline strategies that promote learning and emotional regulation.',
 'aap.org', '2024-08-13', 0.87, 1, true),

('behavior_discipline', '18-24_months',
 'Managing Toddler Tantrums',
 'https://zerotothree.org/tantrums',
 'Understanding why tantrums happen and effective strategies for handling them calmly.',
 'zerotothree.org', '2024-08-04', 0.86, 1, true);

-- Update the last refresh timestamp for content stats
UPDATE topic_content 
SET last_refreshed = NOW() 
WHERE is_active = TRUE;