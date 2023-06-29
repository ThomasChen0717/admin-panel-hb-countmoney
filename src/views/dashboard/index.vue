<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import otherDashboard from './other'

export default {
  name: 'Dashboard',
  components: { adminDashboard, otherDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    if (this.role !== 'admin') {
      this.currentRole = 'otherDashboard'
    }
  }
}
</script>
