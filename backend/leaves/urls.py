from rest_framework.routers import DefaultRouter
from .views import LeaveRequestViewSet

router = DefaultRouter()
router.register(r'', LeaveRequestViewSet, basename='leaves')

urlpatterns = router.urls