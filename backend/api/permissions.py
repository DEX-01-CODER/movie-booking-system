from rest_framework.permissions import BasePermission, SAFE_METHODS

# check if user is admin
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff
    

# allow anyone for the safe methods(get, head, and options) but only admin for making change
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        
        # allowing only admins to make changes
        return request.user.is_authenticated and request.user.is_staff
    

# this is a permission at user level for their data
# user is the foreign key attribute.
class IsOrderOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user