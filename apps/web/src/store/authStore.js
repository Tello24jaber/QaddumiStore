import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, getCurrentUser, getUserProfile } from '../lib/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      // Initialize auth state
      initialize: async () => {
        try {
          set({ isLoading: true })
          
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            const profile = await getUserProfile(session.user.id)
            set({
              user: session.user,
              profile,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const profile = await getUserProfile(session.user.id)
              set({
                user: session.user,
                profile,
                isAuthenticated: true,
                isLoading: false,
              })
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                profile: null,
                isAuthenticated: false,
                isLoading: false,
              })
            }
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      // Sign in with email/password
      signIn: async (email, password) => {
        try {
          set({ isLoading: true })
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          const profile = await getUserProfile(data.user.id)
          
          set({
            user: data.user,
            profile,
            isAuthenticated: true,
            isLoading: false,
          })

          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Sign up with email/password
      signUp: async (email, password, userData = {}) => {
        try {
          set({ isLoading: true })
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData,
            },
          })

          if (error) throw error

          set({ isLoading: false })
          return { success: true, data }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Sign out
      signOut: async () => {
        try {
          set({ isLoading: true })
          
          const { error } = await supabase.auth.signOut()
          if (error) throw error

          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          })

          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Update profile
      updateProfile: async (updates) => {
        try {
          const { user } = get()
          if (!user) throw new Error('No user logged in')

          const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

          if (error) throw error

          set({ profile: data })
          return { success: true, data }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      // Check if user is admin/staff
      isAdmin: () => {
        const { profile } = get()
        return profile?.role === 'admin'
      },

      isStaff: () => {
        const { profile } = get()
        return ['admin', 'staff'].includes(profile?.role)
      },
    }),
    {
      name: 'qaddumi-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
