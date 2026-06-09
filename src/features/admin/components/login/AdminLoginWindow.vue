<script setup>
import {useAdminLogin} from "@/features/admin/composables/login/useAdminLogin.ts";
import {watch} from "vue";
import {useRouter} from "vue-router";

const {
  login,
  password,
  isLoading,
  isSuccess,
  error,
  authentication,
} = useAdminLogin()

const router = useRouter()
watch(isSuccess, (success) => {
  if (success) {
    router.push('/admin')
  }
})


</script>


<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Admin Panel</h2>

      <form @submit.prevent="authentication">
        <div class="form-group">
          <label>Login</label>
          <input
              v-model="login"
              placeholder="admin..."
              required
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
              v-model="password"
              type="password"
              placeholder="admin..."
              required
          />
        </div>

        <p v-if="error" class="error">
          {{ error }}
        </p>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Авторизация...' : 'Вход' }}
        </button>
      </form>
    </div>
  </div>
</template>


<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f9;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

button:hover {
  background: #1d4ed8;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  margin-bottom: 12px;
  font-size: 14px;
}
</style>