
from datetime import date, time
from django.core.management.base import BaseCommand
from django.db import transaction

from employees.models import Employee
from attendance.models import Attendance
from leaves.models import LeaveRequest


class Command(BaseCommand):
    help = "Add demo employees, attendance and leave records"

    @transaction.atomic
    def handle(self, *args, **options):

        # 1. Create demo employees
        employees_data = [
            {
                "name": "Priya Verma",
                "email": "priya@kimoclothing.demo",
                "phone": "9876500002",
                "department": "Human Resources",
                "designation": "HR Executive",
                "joining_date": date(2025, 2, 10),
                "salary": 38000,
                "employment_type": "Full-time",
                "status": "Active",
            },
            {
                "name": "Amit Kumar",
                "email": "amit@kimoclothing.demo",
                "phone": "9876500003",
                "department": "Marketing",
                "designation": "Marketing Executive",
                "joining_date": date(2025, 3, 15),
                "salary": 35000,
                "employment_type": "Full-time",
                "status": "Active",
            },
            {
                "name": "Neha Singh",
                "email": "neha@kimoclothing.demo",
                "phone": "9876500004",
                "department": "Finance",
                "designation": "Accountant",
                "joining_date": date(2024, 8, 20),
                "salary": 42000,
                "employment_type": "Full-time",
                "status": "Active",
            },
            {
                "name": "Arjun Mehta",
                "email": "arjun@kimoclothing.demo",
                "phone": "9876500005",
                "department": "Design",
                "designation": "UI/UX Designer",
                "joining_date": date(2025, 1, 5),
                "salary": 40000,
                "employment_type": "Full-time",
                "status": "Active",
            },
            {
                "name": "Sneha Gupta",
                "email": "sneha@kimoclothing.demo",
                "phone": "9876500006",
                "department": "Operations",
                "designation": "Operations Manager",
                "joining_date": date(2024, 6, 12),
                "salary": 50000,
                "employment_type": "Full-time",
                "status": "Active",
            },
        ]

        employees = {}

        for data in employees_data:
            employee, created = Employee.objects.get_or_create(
                email=data["email"],
                defaults=data
            )
            employees[data["email"]] = employee

            if created:
                self.stdout.write(f"Created employee: {employee.name}")
            else:
                self.stdout.write(f"Already exists: {employee.name}")

        # 2. Include existing Rahul Sharma if present
        rahul = Employee.objects.filter(
            email__iexact="rahul@kimoclothing.demo"
        ).first()

        if rahul:
            employees["rahul@kimoclothing.demo"] = rahul

        # 3. Create attendance records
        attendance_data = [
            ("priya@kimoclothing.demo", date(2026, 11, 16), time(9, 0), time(18, 0), "8h 0m", "Present"),
            ("amit@kimoclothing.demo", date(2026, 11, 16), time(9, 30), time(18, 0), "7h 30m", "Late"),
            ("neha@kimoclothing.demo", date(2026, 11, 16), time(9, 0), time(18, 0), "8h 0m", "Present"),
            ("arjun@kimoclothing.demo", date(2026, 11, 16), None, None, "0h 0m", "Absent"),
            ("sneha@kimoclothing.demo", date(2026, 11, 16), time(9, 0), time(13, 0), "4h 0m", "Half Day"),

            ("priya@kimoclothing.demo", date(2026, 11, 15), time(9, 0), time(18, 0), "8h 0m", "Present"),
            ("amit@kimoclothing.demo", date(2026, 11, 15), time(9, 0), time(18, 0), "8h 0m", "Present"),
            ("neha@kimoclothing.demo", date(2026, 11, 15), time(9, 15), time(18, 0), "7h 45m", "Late"),
        ]

        attendance_count = 0

        for email, attendance_date, check_in, check_out, hours, status in attendance_data:
            employee = employees[email]

            _, created = Attendance.objects.get_or_create(
                employee=employee,
                date=attendance_date,
                defaults={
                    "check_in": check_in,
                    "check_out": check_out,
                    "working_hours": hours,
                    "status": status,
                }
            )

            if created:
                attendance_count += 1

        # 4. Create leave requests
        leave_data = [
            ("priya@kimoclothing.demo", "Casual", date(2026, 11, 20), date(2026, 11, 21), 2, "Personal work", "Pending"),
            ("amit@kimoclothing.demo", "Sick", date(2026, 11, 18), date(2026, 11, 18), 1, "Not feeling well", "Approved"),
            ("neha@kimoclothing.demo", "Annual", date(2026, 11, 25), date(2026, 11, 27), 3, "Family vacation", "Pending"),
            ("arjun@kimoclothing.demo", "Emergency", date(2026, 11, 19), date(2026, 11, 19), 1, "Family emergency", "Rejected"),
            ("sneha@kimoclothing.demo", "Casual", date(2026, 11, 22), date(2026, 11, 22), 1, "Personal appointment", "Approved"),
        ]

        leave_count = 0

        for email, leave_type, start, end, days, reason, status in leave_data:
            employee = employees[email]

            _, created = LeaveRequest.objects.get_or_create(
                employee=employee,
                leave_type=leave_type,
                start_date=start,
                end_date=end,
                defaults={
                    "days": days,
                    "reason": reason,
                    "status": status,
                }
            )

            if created:
                leave_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nDemo data seeding completed!\n"
            f"New attendance records: {attendance_count}\n"
            f"New leave requests: {leave_count}\n"
            f"Total employees in database: {Employee.objects.count()}"
        ))
