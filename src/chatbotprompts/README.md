# Chatbot Prompts Directory

This directory contains system prompts for all AI chatbots used in Little Star.

## Structure

Each chatbot has its own TypeScript file that exports:
- A `createPrompt()` function that takes context and returns a system prompt
- A `createWelcomeMessage()` function for initial user greeting
- Any supporting types or utilities

## Current Chatbots

### Health Assistant (`healthAssistant.ts`)
- **Purpose**: Pediatric health guidance using CDC/WHO guidelines
- **Context**: Child's age, growth data, vaccination status, milestones
- **Safety Features**: Emergency detection, "I don't know" over hallucination
- **Model**: Cost-optimized (Llama-3.1-8B → Claude-3-Haiku → GPT-4o-mini)

## Design Principles

1. **Accuracy over Completeness**: Better to provide limited accurate information than comprehensive but potentially incorrect guidance
2. **Evidence-Based**: Only use information from established medical authorities
3. **Safety First**: Emergency detection, proper disclaimers, professional referrals
4. **Child-Specific**: Leverage actual child data when available
5. **Professional Tone**: Warm but authoritative, concise and actionable

## Adding New Chatbots

1. Create a new TypeScript file: `newChatbot.ts`
2. Export `createPrompt()` and `createWelcomeMessage()` functions
3. Import and use in the appropriate service layer
4. Update this README with the new chatbot details

## Usage Example

```typescript
import { createHealthAssistantPrompt, createWelcomeMessage } from '@/chatbotprompts/healthAssistant'

// In your service layer
const systemPrompt = createHealthAssistantPrompt(childContext)
const welcomeMsg = createWelcomeMessage(childName, childAge)
```

## Medical Disclaimer

The medical disclaimer for all health-related AI responses is now displayed on the landing page footer, not in individual chat responses. This provides better UX while maintaining legal compliance.