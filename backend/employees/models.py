
from django.db import models


class Employee(models.Model):

    DEPARTMENTS = [
        ('Engineering', 'Engineering'),
        ('Human Resources', 'Human Resources'),
        ('Marketing', 'Marketing'),
        ('Finance', 'Finance'),
        ('Design', 'Design'),
        ('Operations', 'Operations'),
    ]

    EMPLOYMENT_TYPES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contract', 'Contract'),
        ('Intern', 'Intern'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('On Leave', 'On Leave'),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    department = models.CharField(max_length=50, choices=DEPARTMENTS)
    designation = models.CharField(max_length=100)
    joining_date = models.DateField()
    salary = models.DecimalField(max_digits=12, decimal_places=2)
    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPES
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Active'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.department}"
