/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.flightBooking.resource;

import com.fasterxml.jackson.annotation.JsonIgnore;
import platform.exception.ExceptionEnum;
 import platform.resource.BaseResource;
import platform.util.*;
import org.springframework.stereotype.Component;
import platform.db.*;
import java.util.*;
import com.flightBooking.message.*;
import com.flightBooking.helper.*;
import com.flightBooking.service.*;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
@Component
 public class Educationdetails2 extends BaseResource {
	private String id = null;
	private String g_created_by_id = null;
	private String g_created_by_name = null;
	private String g_modified_by_id = null;
	private String g_modified_by_name = null;
	private Long g_creation_time = null;
	private Long g_modify_time = null;
	private String g_soft_delete = null;
	private String g_status = null;
	private String archived = null;
	private Long archived_time = null;
	private String applicantid = null;
	private String level = null;
	private String board = null;
	private String specialization = null;
	private String schoolname = null;
	private String grading = null;
	private String passingyear = null;
	private String marksobtained = null;
	private Map<String, Object> extra_data = null;

	public static String FIELD_ID = "id";
	public static String FIELD_G_CREATED_BY_ID = "g_created_by_id";
	public static String FIELD_G_CREATED_BY_NAME = "g_created_by_name";
	public static String FIELD_G_MODIFIED_BY_ID = "g_modified_by_id";
	public static String FIELD_G_MODIFIED_BY_NAME = "g_modified_by_name";
	public static String FIELD_G_CREATION_TIME = "g_creation_time";
	public static String FIELD_G_MODIFY_TIME = "g_modify_time";
	public static String FIELD_G_SOFT_DELETE = "g_soft_delete";
	public static String FIELD_G_STATUS = "g_status";
	public static String FIELD_ARCHIVED = "archived";
	public static String FIELD_ARCHIVED_TIME = "archived_time";
	public static String FIELD_APPLICANTID = "applicantid";
	public static String FIELD_LEVEL = "level";
	public static String FIELD_BOARD = "board";
	public static String FIELD_SPECIALIZATION = "specialization";
	public static String FIELD_SCHOOLNAME = "schoolname";
	public static String FIELD_GRADING = "grading";
	public static String FIELD_PASSINGYEAR = "passingyear";
	public static String FIELD_MARKSOBTAINED = "marksobtained";
	public static String FIELD_EXTRA_DATA = "extra_data";

	private static final long serialVersionUID = 1L;
	public final static ResourceMetaData metaData = new ResourceMetaData("educationdetails2");

	static {
		metaData.setCheckBeforeAdd(false);
		metaData.setCheckBeforeUpdate(false);

		metaData.setAllow_duplicate_name(false);
		Field idField = new Field("id", "String");
		idField.setRequired(true);
		metaData.addField(idField);

		Field g_created_by_idField = new Field("g_created_by_id", "String");
		g_created_by_idField.setLength(128);
		metaData.addField(g_created_by_idField);

		Field g_created_by_nameField = new Field("g_created_by_name", "String");
		g_created_by_nameField.setLength(128);
		metaData.addField(g_created_by_nameField);

		Field g_modified_by_idField = new Field("g_modified_by_id", "String");
		g_modified_by_idField.setLength(128);
		metaData.addField(g_modified_by_idField);

		Field g_modified_by_nameField = new Field("g_modified_by_name", "String");
		g_modified_by_nameField.setLength(128);
		metaData.addField(g_modified_by_nameField);

		Field g_creation_timeField = new Field("g_creation_time", "long");
		metaData.addField(g_creation_timeField);

		Field g_modify_timeField = new Field("g_modify_time", "long");
		metaData.addField(g_modify_timeField);

		Field g_soft_deleteField = new Field("g_soft_delete", "String");
		g_soft_deleteField.setDefaultValue("N");
		g_soft_deleteField.setLength(1);
		metaData.addField(g_soft_deleteField);

		Field g_statusField = new Field("g_status", "String");
		g_statusField.setIndexed(true);
		g_statusField.setLength(32);
		metaData.addField(g_statusField);

		Field archivedField = new Field("archived", "String");
		archivedField.setIndexed(true);
		archivedField.setDefaultValue("N");
		archivedField.setLength(1);
		metaData.addField(archivedField);

		Field archived_timeField = new Field("archived_time", "long");
		metaData.addField(archived_timeField);

		Field applicantidField = new Field("applicantid", "String");
		metaData.addField(applicantidField);

		Field levelField = new Field("level", "String");
		levelField.setRequired(true);
		metaData.addField(levelField);

		Field boardField = new Field("board", "String");
		boardField.setRequired(true);
		metaData.addField(boardField);

		Field specializationField = new Field("specialization", "String");
		specializationField.setRequired(true);
		metaData.addField(specializationField);

		Field schoolnameField = new Field("schoolname", "String");
		schoolnameField.setRequired(true);
		metaData.addField(schoolnameField);

		Field gradingField = new Field("grading", "String");
		gradingField.setRequired(true);
		metaData.addField(gradingField);

		Field passingyearField = new Field("passingyear", "String");
		passingyearField.setRequired(true);
		metaData.addField(passingyearField);

		Field marksobtainedField = new Field("marksobtained", "String");
		marksobtainedField.setRequired(true);
		metaData.addField(marksobtainedField);

		Field extra_dataField = new Field("extra_data", "Map");
		extra_dataField.setValueType("Object");
		metaData.addField(extra_dataField);


		metaData.setTableName("educationdetails2");

		metaData.setCluster("traveler_db");
	}

	public Educationdetails2() {this.setId(Util.getUniqueId());}
	public Educationdetails2(String id) {this.setId(id);}

	public Educationdetails2(Educationdetails2 obj) {
		this.id = obj.id;
		this.g_created_by_id = obj.g_created_by_id;
		this.g_created_by_name = obj.g_created_by_name;
		this.g_modified_by_id = obj.g_modified_by_id;
		this.g_modified_by_name = obj.g_modified_by_name;
		this.g_creation_time = obj.g_creation_time;
		this.g_modify_time = obj.g_modify_time;
		this.g_soft_delete = obj.g_soft_delete;
		this.g_status = obj.g_status;
		this.archived = obj.archived;
		this.archived_time = obj.archived_time;
		this.applicantid = obj.applicantid;
		this.level = obj.level;
		this.board = obj.board;
		this.specialization = obj.specialization;
		this.schoolname = obj.schoolname;
		this.grading = obj.grading;
		this.passingyear = obj.passingyear;
		this.marksobtained = obj.marksobtained;
		this.extra_data = obj.extra_data;
	}

	public ResourceMetaData getMetaData() {
		return metaData;
	}

	private void setDefaultValues() {
		if(g_soft_delete == null)
			g_soft_delete = "N";
		if(archived == null)
			archived = "N";
	}

	public Map<String, Object> convertResourceToMap(HashMap<String, Object> map) {
		if(id != null)
			map.put("id", id);
		if(g_created_by_id != null)
			map.put("g_created_by_id", g_created_by_id);
		if(g_created_by_name != null)
			map.put("g_created_by_name", g_created_by_name);
		if(g_modified_by_id != null)
			map.put("g_modified_by_id", g_modified_by_id);
		if(g_modified_by_name != null)
			map.put("g_modified_by_name", g_modified_by_name);
		if(g_creation_time != null)
			map.put("g_creation_time", g_creation_time);
		if(g_modify_time != null)
			map.put("g_modify_time", g_modify_time);
		if(g_soft_delete != null)
			map.put("g_soft_delete", g_soft_delete);
		if(g_status != null)
			map.put("g_status", g_status);
		if(archived != null)
			map.put("archived", archived);
		if(archived_time != null)
			map.put("archived_time", archived_time);
		if(applicantid != null)
			map.put("applicantid", applicantid);
		if(level != null)
			map.put("level", level);
		if(board != null)
			map.put("board", board);
		if(specialization != null)
			map.put("specialization", specialization);
		if(schoolname != null)
			map.put("schoolname", schoolname);
		if(grading != null)
			map.put("grading", grading);
		if(passingyear != null)
			map.put("passingyear", passingyear);
		if(marksobtained != null)
			map.put("marksobtained", marksobtained);
		if(extra_data != null)
			map.put("extra_data", extra_data);
		return map;
	}

	public Map<String, Object> validateAndConvertResourceToMap(HashMap<String,Object> map,boolean add) throws ApplicationException {
		if(validateId(add))
			map.put("id", id);
		if(g_created_by_id != null)
			map.put("g_created_by_id", g_created_by_id);
		if(g_created_by_name != null)
			map.put("g_created_by_name", g_created_by_name);
		if(g_modified_by_id != null)
			map.put("g_modified_by_id", g_modified_by_id);
		if(g_modified_by_name != null)
			map.put("g_modified_by_name", g_modified_by_name);
		if(g_creation_time != null)
			map.put("g_creation_time", g_creation_time);
		if(g_modify_time != null)
			map.put("g_modify_time", g_modify_time);
		if(g_soft_delete != null)
			map.put("g_soft_delete", g_soft_delete);
		if(g_status != null)
			map.put("g_status", g_status);
		if(archived != null)
			map.put("archived", archived);
		if(archived_time != null)
			map.put("archived_time", archived_time);
		if(applicantid != null)
			map.put("applicantid", applicantid);
		if(validateLevel(add))
			map.put("level", level);
		if(validateBoard(add))
			map.put("board", board);
		if(validateSpecialization(add))
			map.put("specialization", specialization);
		if(validateSchoolname(add))
			map.put("schoolname", schoolname);
		if(validateGrading(add))
			map.put("grading", grading);
		if(validatePassingyear(add))
			map.put("passingyear", passingyear);
		if(validateMarksobtained(add))
			map.put("marksobtained", marksobtained);
		if(extra_data != null)
			map.put("extra_data", extra_data);
		return map;
	}

	public Map<String, Object> convertResourceToPrimaryMap(HashMap<String, Object> map) {
		return map;
	}

	@SuppressWarnings("unchecked")
	public void convertMapToResource(Map<String, Object> map) {
		id = (String) map.get("id");
		g_created_by_id = (String) map.get("g_created_by_id");
		g_created_by_name = (String) map.get("g_created_by_name");
		g_modified_by_id = (String) map.get("g_modified_by_id");
		g_modified_by_name = (String) map.get("g_modified_by_name");
		g_creation_time = (map.get("g_creation_time") == null ? null : ((Number) map.get("g_creation_time")).longValue());
		g_modify_time = (map.get("g_modify_time") == null ? null : ((Number) map.get("g_modify_time")).longValue());
		g_soft_delete = (String) map.get("g_soft_delete");
		g_status = (String) map.get("g_status");
		archived = (String) map.get("archived");
		archived_time = (map.get("archived_time") == null ? null : ((Number) map.get("archived_time")).longValue());
		applicantid = (String) map.get("applicantid");
		level = (String) map.get("level");
		board = (String) map.get("board");
		specialization = (String) map.get("specialization");
		schoolname = (String) map.get("schoolname");
		grading = (String) map.get("grading");
		passingyear = (String) map.get("passingyear");
		marksobtained = (String) map.get("marksobtained");
		extra_data = (Map<String, Object>) map.get("extra_data");
	}

	@SuppressWarnings("unchecked")
	public void convertTypeUnsafeMapToResource(Map<String, Object> map) {
		Object idObj = map.get("id");
		if(idObj != null)
			id = idObj.toString();

		Object g_created_by_idObj = map.get("g_created_by_id");
		if(g_created_by_idObj != null)
			g_created_by_id = g_created_by_idObj.toString();

		Object g_created_by_nameObj = map.get("g_created_by_name");
		if(g_created_by_nameObj != null)
			g_created_by_name = g_created_by_nameObj.toString();

		Object g_modified_by_idObj = map.get("g_modified_by_id");
		if(g_modified_by_idObj != null)
			g_modified_by_id = g_modified_by_idObj.toString();

		Object g_modified_by_nameObj = map.get("g_modified_by_name");
		if(g_modified_by_nameObj != null)
			g_modified_by_name = g_modified_by_nameObj.toString();

		Object g_creation_timeObj = map.get("g_creation_time");
		if(g_creation_timeObj != null)
			g_creation_time = new Long(g_creation_timeObj.toString());

		Object g_modify_timeObj = map.get("g_modify_time");
		if(g_modify_timeObj != null)
			g_modify_time = new Long(g_modify_timeObj.toString());

		Object g_soft_deleteObj = map.get("g_soft_delete");
		if(g_soft_deleteObj != null)
			g_soft_delete = g_soft_deleteObj.toString();

		Object g_statusObj = map.get("g_status");
		if(g_statusObj != null)
			g_status = g_statusObj.toString();

		Object archivedObj = map.get("archived");
		if(archivedObj != null)
			archived = archivedObj.toString();

		Object archived_timeObj = map.get("archived_time");
		if(archived_timeObj != null)
			archived_time = new Long(archived_timeObj.toString());

		Object applicantidObj = map.get("applicantid");
		if(applicantidObj != null)
			applicantid = applicantidObj.toString();

		Object levelObj = map.get("level");
		if(levelObj != null)
			level = levelObj.toString();

		Object boardObj = map.get("board");
		if(boardObj != null)
			board = boardObj.toString();

		Object specializationObj = map.get("specialization");
		if(specializationObj != null)
			specialization = specializationObj.toString();

		Object schoolnameObj = map.get("schoolname");
		if(schoolnameObj != null)
			schoolname = schoolnameObj.toString();

		Object gradingObj = map.get("grading");
		if(gradingObj != null)
			grading = gradingObj.toString();

		Object passingyearObj = map.get("passingyear");
		if(passingyearObj != null)
			passingyear = passingyearObj.toString();

		Object marksobtainedObj = map.get("marksobtained");
		if(marksobtainedObj != null)
			marksobtained = marksobtainedObj.toString();

		extra_data = (Map<String, Object>) map.get("extra_data");
	}

	public void convertPrimaryMapToResource(Map<String, Object> map) {
	}

	public void convertTypeUnsafePrimaryMapToResource(Map<String, Object> map) {
	}

	public String getId() {
		return id;
	}

	public String getIdEx() {
		return id != null ? id : "";
	}

	public void setId(String id) {
		this.id = id;
	}

	public void unSetId() {
		this.id = null;
	}

	public boolean validateId(boolean add) throws ApplicationException {
		if(add && id == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[id]");
		return id != null;
	}

	public String getG_created_by_id() {
		return g_created_by_id;
	}

	public String getG_created_by_idEx() {
		return g_created_by_id != null ? g_created_by_id : "";
	}

	public void setG_created_by_id(String g_created_by_id) {
		this.g_created_by_id = g_created_by_id;
	}

	public void unSetG_created_by_id() {
		this.g_created_by_id = null;
	}

	public String getG_created_by_name() {
		return g_created_by_name;
	}

	public String getG_created_by_nameEx() {
		return g_created_by_name != null ? g_created_by_name : "";
	}

	public void setG_created_by_name(String g_created_by_name) {
		this.g_created_by_name = g_created_by_name;
	}

	public void unSetG_created_by_name() {
		this.g_created_by_name = null;
	}

	public String getG_modified_by_id() {
		return g_modified_by_id;
	}

	public String getG_modified_by_idEx() {
		return g_modified_by_id != null ? g_modified_by_id : "";
	}

	public void setG_modified_by_id(String g_modified_by_id) {
		this.g_modified_by_id = g_modified_by_id;
	}

	public void unSetG_modified_by_id() {
		this.g_modified_by_id = null;
	}

	public String getG_modified_by_name() {
		return g_modified_by_name;
	}

	public String getG_modified_by_nameEx() {
		return g_modified_by_name != null ? g_modified_by_name : "";
	}

	public void setG_modified_by_name(String g_modified_by_name) {
		this.g_modified_by_name = g_modified_by_name;
	}

	public void unSetG_modified_by_name() {
		this.g_modified_by_name = null;
	}

	public Long getG_creation_time() {
		return g_creation_time;
	}

	public long getG_creation_timeEx() {
		return g_creation_time != null ? g_creation_time : 0L;
	}

	public void setG_creation_time(long g_creation_time) {
		this.g_creation_time = g_creation_time;
	}

	@JsonIgnore
	public void setG_creation_time(Long g_creation_time) {
		this.g_creation_time = g_creation_time;
	}

	public void unSetG_creation_time() {
		this.g_creation_time = null;
	}

	public Long getG_modify_time() {
		return g_modify_time;
	}

	public long getG_modify_timeEx() {
		return g_modify_time != null ? g_modify_time : 0L;
	}

	public void setG_modify_time(long g_modify_time) {
		this.g_modify_time = g_modify_time;
	}

	@JsonIgnore
	public void setG_modify_time(Long g_modify_time) {
		this.g_modify_time = g_modify_time;
	}

	public void unSetG_modify_time() {
		this.g_modify_time = null;
	}

	public String getG_soft_delete() {
		return g_soft_delete != null ? g_soft_delete : "N";
	}

	public void setG_soft_delete(String g_soft_delete) {
		this.g_soft_delete = g_soft_delete;
	}

	public void unSetG_soft_delete() {
		this.g_soft_delete = "N";
	}

	public String getG_status() {
		return g_status;
	}

	public String getG_statusEx() {
		return g_status != null ? g_status : "";
	}

	public void setG_status(String g_status) {
		this.g_status = g_status;
	}

	public void unSetG_status() {
		this.g_status = null;
	}

	public String getArchived() {
		return archived != null ? archived : "N";
	}

	public void setArchived(String archived) {
		this.archived = archived;
	}

	public void unSetArchived() {
		this.archived = "N";
	}

	public Long getArchived_time() {
		return archived_time;
	}

	public long getArchived_timeEx() {
		return archived_time != null ? archived_time : 0L;
	}

	public void setArchived_time(long archived_time) {
		this.archived_time = archived_time;
	}

	@JsonIgnore
	public void setArchived_time(Long archived_time) {
		this.archived_time = archived_time;
	}

	public void unSetArchived_time() {
		this.archived_time = null;
	}

	public String getApplicantid() {
		return applicantid;
	}

	public String getApplicantidEx() {
		return applicantid != null ? applicantid : "";
	}

	public void setApplicantid(String applicantid) {
		this.applicantid = applicantid;
	}

	public void unSetApplicantid() {
		this.applicantid = null;
	}

	public String getLevel() {
		return level;
	}

	public String getLevelEx() {
		return level != null ? level : "";
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public void unSetLevel() {
		this.level = null;
	}

	public boolean validateLevel(boolean add) throws ApplicationException {
		if(add && level == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[level]");
		return level != null;
	}

	public String getBoard() {
		return board;
	}

	public String getBoardEx() {
		return board != null ? board : "";
	}

	public void setBoard(String board) {
		this.board = board;
	}

	public void unSetBoard() {
		this.board = null;
	}

	public boolean validateBoard(boolean add) throws ApplicationException {
		if(add && board == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[board]");
		return board != null;
	}

	public String getSpecialization() {
		return specialization;
	}

	public String getSpecializationEx() {
		return specialization != null ? specialization : "";
	}

	public void setSpecialization(String specialization) {
		this.specialization = specialization;
	}

	public void unSetSpecialization() {
		this.specialization = null;
	}

	public boolean validateSpecialization(boolean add) throws ApplicationException {
		if(add && specialization == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[specialization]");
		return specialization != null;
	}

	public String getSchoolname() {
		return schoolname;
	}

	public String getSchoolnameEx() {
		return schoolname != null ? schoolname : "";
	}

	public void setSchoolname(String schoolname) {
		this.schoolname = schoolname;
	}

	public void unSetSchoolname() {
		this.schoolname = null;
	}

	public boolean validateSchoolname(boolean add) throws ApplicationException {
		if(add && schoolname == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[schoolname]");
		return schoolname != null;
	}

	public String getGrading() {
		return grading;
	}

	public String getGradingEx() {
		return grading != null ? grading : "";
	}

	public void setGrading(String grading) {
		this.grading = grading;
	}

	public void unSetGrading() {
		this.grading = null;
	}

	public boolean validateGrading(boolean add) throws ApplicationException {
		if(add && grading == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[grading]");
		return grading != null;
	}

	public String getPassingyear() {
		return passingyear;
	}

	public String getPassingyearEx() {
		return passingyear != null ? passingyear : "";
	}

	public void setPassingyear(String passingyear) {
		this.passingyear = passingyear;
	}

	public void unSetPassingyear() {
		this.passingyear = null;
	}

	public boolean validatePassingyear(boolean add) throws ApplicationException {
		if(add && passingyear == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[passingyear]");
		return passingyear != null;
	}

	public String getMarksobtained() {
		return marksobtained;
	}

	public String getMarksobtainedEx() {
		return marksobtained != null ? marksobtained : "";
	}

	public void setMarksobtained(String marksobtained) {
		this.marksobtained = marksobtained;
	}

	public void unSetMarksobtained() {
		this.marksobtained = null;
	}

	public boolean validateMarksobtained(boolean add) throws ApplicationException {
		if(add && marksobtained == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[marksobtained]");
		return marksobtained != null;
	}

	public Map<String, Object> getExtra_data() {
		return extra_data;
	}

	public Object getExtra_data(String key) {
		return extra_data == null ? null : extra_data.get(key);
	}

	public void setExtra_data(Map<String, Object> extra_data) {
		this.extra_data = extra_data;
	}

	public void setExtra_data(String key, Object value) {
		if(extra_data == null)
			extra_data = new HashMap<String, Object>();
		extra_data.put(key, value);
	}

	public void unSetExtra_data() {
		this.extra_data = null;
	}
	public String getCluster() {
		return "traveler_db";
	}
	public String getClusterType() {
		return "REPLICATED";
	}
	public  Class<?> getResultClass() {return Educationdetails2Result.class;};
	public  Class<?> getMessageClass() {return Educationdetails2Message.class;};
	public  Class<?> getHelperClass() {return Educationdetails2Helper.class;};
	public  Class<?> getServiceClass() {return Educationdetails2Service.class;};
}