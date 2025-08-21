import { contentRefreshScheduler } from './contentRefreshScheduler'

export class AppInitializer {
  private static initialized = false

  static async initialize() {
    if (this.initialized) return

    console.log('🚀 Initializing MilestoneBee services...')

    try {
      // Initialize content refresh scheduler
      // The scheduler is already initialized when imported, just log it
      console.log('📅 Content refresh scheduler active')
      
      // In a real production environment, you might want to:
      // 1. Check for missed refreshes
      // 2. Run initial content seeding if database is empty
      // 3. Verify API keys and connections
      
      this.initialized = true
      console.log('✅ MilestoneBee services initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize services:', error)
      throw error
    }
  }

  static async checkDatabaseHealth() {
    try {
      const stats = await contentRefreshScheduler.getContentStats()
      console.log('📊 Content database stats:', {
        totalArticles: stats.totalArticles,
        lastRefresh: stats.lastSystemRefresh
      })
      
      if (stats.totalArticles === 0) {
        console.log('⚠️ No content found in database. Consider running initial content refresh.')
        return false
      }
      
      return true
    } catch (error) {
      console.error('❌ Database health check failed:', error)
      return false
    }
  }

  static async seedInitialContent() {
    console.log('🌱 Seeding initial content...')
    
    try {
      await contentRefreshScheduler.triggerManualRefresh()
      console.log('✅ Initial content seeding completed')
    } catch (error) {
      console.error('❌ Initial content seeding failed:', error)
      throw error
    }
  }

  // For development/testing purposes
  static async runHealthCheck() {
    const isHealthy = await this.checkDatabaseHealth()
    
    if (!isHealthy) {
      console.log('🔄 Running initial content refresh due to empty database...')
      // In development, you might want to automatically seed content
      // await this.seedInitialContent()
    }
    
    return isHealthy
  }
}

// Auto-initialize when module is loaded
if (typeof window !== 'undefined') {
  AppInitializer.initialize().catch(error => {
    console.error('Failed to initialize app services:', error)
  })
}