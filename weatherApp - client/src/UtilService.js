import axios from 'axios';

export default class UtilsService {

    getItems(url) {
        return axios.get(url).then(res => res.data);
    }

   getItemByName(url,name) {
        return axios.get(`${url}${name}`).then(res => res.data);
    }
    updateUserDetails(url,id,obj) {
        return  axios.put(`${url}/${id}`, obj).then(res => res.data); 
      
    }
    
    addItem(url,obj) {
        return  axios.post(`${url}`, obj).then(res => res.data); 
      
    }
}