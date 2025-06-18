package com.flightBooking;
import platform.helper.HelperManager;
import platform.webservice.ServiceManager;
import com.flightBooking.helper.*;
import com.flightBooking.service.*;
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
		}
}
