
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Attendance
from employees.models import Employee
from rest_framework import serializers


class AttendanceSerializer(serializers.ModelSerializer):

    employeeId = serializers.PrimaryKeyRelatedField(
        source='employee',
        queryset=Employee.objects.all()
    )

    employeeName = serializers.CharField(
        source='employee.name',
        read_only=True
    )

    checkIn = serializers.TimeField(
        source='check_in',
        required=False,
        allow_null=True
    )

    checkOut = serializers.TimeField(
        source='check_out',
        required=False,
        allow_null=True
    )

    workingHours = serializers.CharField(
        source='working_hours',
        required=False
    )

    class Meta:
        model = Attendance
        fields = [
            'id',
            'employeeId',
            'employeeName',
            'date',
            'checkIn',
            'checkOut',
            'workingHours',
            'status',
        ]


class AttendanceViewSet(viewsets.ModelViewSet):

    queryset = Attendance.objects.select_related('employee').all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]
