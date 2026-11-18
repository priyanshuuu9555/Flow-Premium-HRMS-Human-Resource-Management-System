
from rest_framework import viewsets, serializers
from rest_framework.permissions import AllowAny

from .models import LeaveRequest
from employees.models import Employee


class LeaveRequestSerializer(serializers.ModelSerializer):

    employeeId = serializers.PrimaryKeyRelatedField(
        source='employee',
        queryset=Employee.objects.all()
    )

    employeeName = serializers.CharField(
        source='employee.name',
        read_only=True
    )

    leaveType = serializers.ChoiceField(
        source='leave_type',
        choices=LeaveRequest.LEAVE_TYPES
    )

    startDate = serializers.DateField(source='start_date')
    endDate = serializers.DateField(source='end_date')
    appliedOn = serializers.DateTimeField(
        source='applied_on',
        read_only=True
    )

    class Meta:
        model = LeaveRequest
        fields = [
            'id',
            'employeeId',
            'employeeName',
            'leaveType',
            'startDate',
            'endDate',
            'days',
            'reason',
            'status',
            'appliedOn',
        ]

    def validate(self, attrs):
        start = attrs.get('start_date')
        end = attrs.get('end_date')

        if start and end and end < start:
            raise serializers.ValidationError(
                {'endDate': 'End date cannot be before start date.'}
            )

        return attrs


class LeaveRequestViewSet(viewsets.ModelViewSet):

    queryset = LeaveRequest.objects.select_related('employee').all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [AllowAny]
