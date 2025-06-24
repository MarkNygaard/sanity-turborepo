// components/tools/personalDashboardWrapper.tsx
import { UsersIcon } from '@sanity/icons'
import { Card, Container, Flex, Spinner, Text } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { Tool, useClient } from 'sanity'
import Dashboard from './personalDashboard/components/Dashboard'
import { fetchLanguagesMarketsAndPerson } from '../../utils/fetchLanguagesMarketsAndPerson'
import { dataset, projectId } from '../../lib/api'

// Define the type for dashboard data
type DashboardData = {
  markets: any[]
  languages: any[]
  person: any
} | null

function PersonalDashboardWrapper() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const client = useClient()

  useEffect(() => {
    fetchLanguagesMarketsAndPerson()
      .then((data) => {
        if (data) {
          setDashboardData(data)
        } else {
          setError('No dashboard data available')
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load dashboard data:', error)
        setError('Failed to load dashboard data')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Container width={4} padding={4}>
        <Card padding={4} tone="transparent">
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text>Loading personal dashboard...</Text>
          </Flex>
        </Card>
      </Container>
    )
  }

  if (error || !dashboardData) {
    return (
      <Container width={4} padding={4}>
        <Card padding={4} tone="caution">
          <Text>{error || 'Personal dashboard unavailable'}</Text>
        </Card>
      </Container>
    )
  }

  // Create a minimal context object that matches ConfigContext
  const mockContext = {
    projectId,
    dataset,
    schema: null, // Dashboard doesn't seem to use schema directly
    currentUser: null,
    client,
    getClient: () => client,
  }

  // Render the Dashboard component directly
  return <Dashboard languagesMarketsAndPerson={dashboardData} context={mockContext as any} />
}

export const personalDashboardTool: Tool = {
  name: 'personal-dashboard',
  title: 'Personal Dashboard',
  icon: UsersIcon,
  component: PersonalDashboardWrapper,
}
