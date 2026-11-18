
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Employee API
    path('api/', include('employees.urls')),

    # Attendance API
    path('api/attendance/', include('attendance.urls')),

    # Leave Management API
    path('api/leaves/', include('leaves.urls')),
    path('api/auth/', include('accounts.urls')),
]
