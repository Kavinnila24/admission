package com.flightBooking.decorator;

import com.flightBooking.helper.ApplicantHelper;
import com.flightBooking.resource.Applicant;
import com.google.common.base.Objects;
import org.springframework.stereotype.Component;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.webservice.ServletContext;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;

@Component
public class ApplicantDecorator extends BaseDecorator {

    private static final int MINIMUM_AGE = 16;

    public ApplicantDecorator() {
        super(new Applicant());
    }

    // Uniqueness check for mobile, email, abc ID
    private void uniquenessCheck(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Applicant newApplicant = (Applicant) _resource;

        BaseResource[] existingApplicants = ApplicantHelper.getInstance().getAll();
        for (BaseResource res : existingApplicants) {
            Applicant existing = (Applicant) res;

            if (Objects.equal(existing.getMobile(), newApplicant.getMobile())) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "Mobile number already exists");
            }

            if (Objects.equal(existing.getEmail(), newApplicant.getEmail())) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "Email ID already exists");
            }

            if (Objects.equal(existing.getAbc(), newApplicant.getAbc())) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "ABC ID already exists");
            }
        }
    }

    // DOB and age validation
    private void validateDOB(Applicant applicant) throws ApplicationException {
        Date dob = applicant.getDob();
        if (dob == null) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Date of Birth cannot be empty");
        }

        LocalDate birthDate = dob.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate today = LocalDate.now();

        if (birthDate.isAfter(today)) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Date of Birth cannot be in the future");
        }

        int age = Period.between(birthDate, today).getYears();
        if (age < MINIMUM_AGE) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Applicant must be at least " + MINIMUM_AGE + " years old");
        }
    }

    // Name validations
    private void validateNames(Applicant applicant) throws ApplicationException {
        if (applicant.getFullname12() == null || applicant.getFullname12().trim().isEmpty()) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Full Name (12th standard) cannot be empty");
        }

        if (applicant.getFullnamead() == null || applicant.getFullnamead().trim().isEmpty()) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Full Name (Aadhar) cannot be empty");
        }
    }

    @Override
    public void preAddDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Applicant applicant = (Applicant) _resource;

        uniquenessCheck(stx, _resource);     // Check for mobile/email/abc uniqueness
        validateDOB(applicant);              // Check DOB is valid and age >= 16
        validateNames(applicant);            // Check names are not empty
    }

    @Override
    public void preModifyDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Applicant applicant = (Applicant) _resource;

        uniquenessCheck(stx, _resource);
        validateDOB(applicant);
        validateNames(applicant);
    }
}

