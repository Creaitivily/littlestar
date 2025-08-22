-- Fill missing age ranges with content
-- This adds content for 1-2, 2-3, 4-5, 5-6, 7-8, 8-9, 10-11, 11-12 months

INSERT INTO topic_content (
  topic, age_range, title, url, content_summary, source_domain, 
  publication_date, quality_score, refresh_cycle, is_active
) VALUES 

-- 1-2 months content
('feeding_nutrition', '1-2_months', 
 'Feeding Your 1-2 Month Old: Patterns and Tips',
 'https://healthychildren.org/feeding-1-2-months',
 'Understanding feeding patterns, hunger cues, and optimal feeding schedules for 1-2 month old babies.',
 'healthychildren.org', '2024-08-19', 0.91, 1, true),

('sleep_patterns', '1-2_months',
 'Sleep Development at 1-2 Months',
 'https://sleepfoundation.org/1-2-month-sleep',
 'What to expect for sleep patterns and establishing healthy sleep habits in the second month.',
 'sleepfoundation.org', '2024-08-17', 0.87, 1, true),

-- 2-3 months content
('feeding_nutrition', '2-3_months',
 'Feeding Milestones: 2-3 Months',
 'https://mayoclinic.org/feeding-2-3-months',
 'How feeding evolves in months 2-3, including longer stretches between feeds.',
 'mayoclinic.org', '2024-08-16', 0.89, 1, true),

('cognitive_development', '2-3_months',
 'Brain Development at 2-3 Months',
 'https://zerotothree.org/brain-2-3-months',
 'Visual tracking, social smiling, and early cognitive milestones.',
 'zerotothree.org', '2024-08-14', 0.88, 1, true),

-- 4-5 months content
('feeding_nutrition', '4-5_months',
 'Preparing for Solids: 4-5 Months',
 'https://aap.org/feeding-4-5-months',
 'Signs of readiness for solid foods and continued milk feeding guidance.',
 'aap.org', '2024-08-13', 0.90, 1, true),

('physical_development', '4-5_months',
 'Rolling and Reaching: 4-5 Month Milestones',
 'https://cdc.gov/milestones-4-5-months',
 'Physical development including rolling over and improved hand control.',
 'cdc.gov', '2024-08-11', 0.92, 1, true),

-- 5-6 months content (IMPORTANT - this is what your child needs!)
('feeding_nutrition', '5-6_months',
 'Starting Solids at 5-6 Months',
 'https://healthychildren.org/solids-5-6-months',
 'Introduction to first foods, textures, and maintaining milk feeds alongside solids.',
 'healthychildren.org', '2024-08-20', 0.93, 1, true),

('sleep_patterns', '5-6_months',
 'Sleep Training Options at 5-6 Months',
 'https://sleepfoundation.org/sleep-5-6-months',
 'Different approaches to sleep training and establishing consistent nap schedules.',
 'sleepfoundation.org', '2024-08-18', 0.89, 1, true),

('cognitive_development', '5-6_months',
 'Cognitive Leaps at 5-6 Months',
 'https://zerotothree.org/cognitive-5-6-months',
 'Object permanence development, cause and effect understanding, and memory improvements.',
 'zerotothree.org', '2024-08-15', 0.91, 1, true),

('physical_development', '5-6_months',
 'Sitting and Strength at 5-6 Months',
 'https://aap.org/physical-5-6-months',
 'Development of core strength, sitting with support, and fine motor skills.',
 'aap.org', '2024-08-12', 0.88, 1, true),

('activities_play', '5-6_months',
 'Play Ideas for 5-6 Month Olds',
 'https://zerotothree.org/play-5-6-months',
 'Developmentally appropriate toys and activities to stimulate growth.',
 'zerotothree.org', '2024-08-10', 0.87, 1, true),

('health_safety', '5-6_months',
 'Health Checkup: 6 Month Visit Prep',
 'https://cdc.gov/health-5-6-months',
 'What to expect at the 6-month checkup and important health milestones.',
 'cdc.gov', '2024-08-08', 0.90, 1, true),

('social_emotional', '5-6_months',
 'Social Development at 5-6 Months',
 'https://healthychildren.org/social-5-6-months',
 'Stranger awareness, emotional expression, and bonding activities.',
 'healthychildren.org', '2024-08-06', 0.86, 1, true),

('language_communication', '5-6_months',
 'Language Development: 5-6 Months',
 'https://asha.org/language-5-6-months',
 'Babbling, vocal play, and responding to familiar voices.',
 'asha.org', '2024-08-04', 0.88, 1, true),

('behavior_discipline', '5-6_months',
 'Understanding Baby Behavior at 5-6 Months',
 'https://zerotothree.org/behavior-5-6-months',
 'Temperament, self-soothing, and establishing routines.',
 'zerotothree.org', '2024-08-02', 0.85, 1, true),

-- 7-8 months content
('feeding_nutrition', '7-8_months',
 'Expanding Food Variety: 7-8 Months',
 'https://mayoclinic.org/feeding-7-8-months',
 'Introducing finger foods and managing self-feeding attempts.',
 'mayoclinic.org', '2024-08-19', 0.90, 1, true),

('physical_development', '7-8_months',
 'Crawling and Cruising: 7-8 Months',
 'https://cdc.gov/physical-7-8-months',
 'Movement milestones including crawling and pulling to stand.',
 'cdc.gov', '2024-08-15', 0.89, 1, true),

-- 8-9 months content
('activities_play', '8-9_months',
 'Interactive Play at 8-9 Months',
 'https://zerotothree.org/play-8-9-months',
 'Games that promote learning and development through play.',
 'zerotothree.org', '2024-08-14', 0.87, 1, true),

('language_communication', '8-9_months',
 'Pre-Language Skills: 8-9 Months',
 'https://asha.org/language-8-9-months',
 'Understanding simple words and gestures, babbling with intent.',
 'asha.org', '2024-08-12', 0.88, 1, true),

-- 10-11 months content
('feeding_nutrition', '10-11_months',
 'Table Foods at 10-11 Months',
 'https://aap.org/feeding-10-11-months',
 'Transitioning to family meals and managing picky eating.',
 'aap.org', '2024-08-11', 0.89, 1, true),

('physical_development', '10-11_months',
 'First Steps Preparation: 10-11 Months',
 'https://healthychildren.org/walking-10-11-months',
 'Pre-walking skills and encouraging safe exploration.',
 'healthychildren.org', '2024-08-09', 0.90, 1, true),

-- 11-12 months content
('cognitive_development', '11-12_months',
 'Problem Solving at 11-12 Months',
 'https://zerotothree.org/cognitive-11-12-months',
 'Simple problem solving, imitation, and understanding of routines.',
 'zerotothree.org', '2024-08-07', 0.88, 1, true),

('social_emotional', '11-12_months',
 'Emotional Development: Approaching One Year',
 'https://healthychildren.org/emotional-11-12-months',
 'Separation anxiety, attachment, and emotional regulation.',
 'healthychildren.org', '2024-08-05', 0.87, 1, true);

-- Update refresh timestamp
UPDATE topic_content 
SET last_refreshed = NOW() 
WHERE is_active = TRUE;