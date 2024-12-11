"use client"

import { Card } from "@/components/ui/card"
import ProfileHeader from "@/components/profile/profile-header"
import { DietaryPreferences } from "@/components/profile/dietary-preferences"
import EthicalPreferences from "@/components/profile/ethical-preferences"
import NotificationSettings from "@/components/profile/notification-settings"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <ProfileHeader />
      </Card>

      <div className="mt-8 space-y-8">
        <Card className="p-6">
          <DietaryPreferences />
        </Card>

        <Card className="p-6">
          <EthicalPreferences />
        </Card>

        <Card className="p-6">
          <NotificationSettings />
        </Card>
      </div>
    </div>
  )
}