package com.rasp.app.controller;

import com.rasp.app.resource.Gender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class GenderController {
@GetMapping("/api/Gender")
  public List<Object>  getEnums() throws IllegalAccessException {
   Field[] fields = Gender.class.getFields();
 List<Object> names=new ArrayList<>();
 for(Field f:fields){
   if(f.getName().startsWith("ID")){
continue;
}
 Object value = f.get(null);
 names.add(value); 
 }
 return names;
}
}