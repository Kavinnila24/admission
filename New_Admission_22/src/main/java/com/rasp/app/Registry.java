package com.rasp.app;
import platform.helper.HelperManager;
import platform.webservice.ServiceManager;
import com.rasp.app.helper.*;
import com.rasp.app.service.*;
public class Registry {
		public static void register(){
				 HelperManager.getInstance().register(ApplicantHelper.getInstance());
				 HelperManager.getInstance().register(CourseeHelper.getInstance());
				 HelperManager.getInstance().register(CurrentaddressHelper.getInstance());
				 HelperManager.getInstance().register(EducationdetailsHelper.getInstance());
				 HelperManager.getInstance().register(Educationdetails2Helper.getInstance());
				 HelperManager.getInstance().register(ExamdetailsHelper.getInstance());
				 HelperManager.getInstance().register(Examdetails2Helper.getInstance());
				 HelperManager.getInstance().register(GuardianHelper.getInstance());
				 HelperManager.getInstance().register(OlympiadHelper.getInstance());
				 HelperManager.getInstance().register(PermaddressHelper.getInstance());
				 HelperManager.getInstance().register(ProgrampreferenceHelper.getInstance());
				 HelperManager.getInstance().register(ResourceRoleHelper.getInstance());
				 HelperManager.getInstance().register(RoleResourcePermissionHelper.getInstance());
				 HelperManager.getInstance().register(RoleUserResInstanceHelper.getInstance());
				 HelperManager.getInstance().register(UsersHelper.getInstance());
				 ServiceManager.getInstance().register(new ApplicantService());
				 ServiceManager.getInstance().register(new CourseeService());
				 ServiceManager.getInstance().register(new CurrentaddressService());
				 ServiceManager.getInstance().register(new EducationdetailsService());
				 ServiceManager.getInstance().register(new Educationdetails2Service());
				 ServiceManager.getInstance().register(new ExamdetailsService());
				 ServiceManager.getInstance().register(new Examdetails2Service());
				 ServiceManager.getInstance().register(new GuardianService());
				 ServiceManager.getInstance().register(new OlympiadService());
				 ServiceManager.getInstance().register(new PermaddressService());
				 ServiceManager.getInstance().register(new ProgrampreferenceService());
				 ServiceManager.getInstance().register(new ResourceRoleService());
				 ServiceManager.getInstance().register(new RoleResourcePermissionService());
				 ServiceManager.getInstance().register(new RoleUserResInstanceService());
				 ServiceManager.getInstance().register(new UsersService());
		}
}
