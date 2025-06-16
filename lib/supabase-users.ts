import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  auth_user_id: string
  email: string
  job: string | null
  skills: string[] | null
  created_at: string
  updated_at: string
}

export interface UserFormData {
  job: string
  skills: string[]
}

// Save or update user profile with job and skills
export async function saveUserProfile(authUser: User, formData: UserFormData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!formData.job.trim()) {
      return { success: false, error: 'Job title is required' }
    }

    if (!formData.skills.length || formData.skills.some(skill => !skill.trim())) {
      return { success: false, error: 'At least one skill is required' }
    }

    // Clean up skills array - remove empty strings and trim whitespace
    const cleanSkills = formData.skills
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)

    if (cleanSkills.length === 0) {
      return { success: false, error: 'At least one valid skill is required' }
    }

    const { error } = await supabase
      .from('users')
      .upsert({
        auth_user_id: authUser.id,
        email: authUser.email || '',
        job: formData.job.trim(),
        skills: cleanSkills,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'auth_user_id'
      })

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: 'Failed to save profile. Please try again.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Save profile error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

// Get user profile by auth user ID
export async function getUserProfile(authUserId: string): Promise<{ data: UserProfile | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Get profile error:', error)
      return { data: null, error: 'Failed to load profile' }
    }

    return { data: data || null }
  } catch (error) {
    console.error('Get profile error:', error)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

// Parse skills string into array (for form input)
export function parseSkillsString(skillsString: string): string[] {
  return skillsString
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0)
}

// Convert skills array to string (for form display)
export function skillsArrayToString(skills: string[]): string {
  return skills.join(', ')
}