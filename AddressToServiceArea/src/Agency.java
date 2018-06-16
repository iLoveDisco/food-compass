public class Agency {
	String id;
	String name;
	String address;
	String zipCode;
	String url;
	String phoneNumber1;
	String phoneNumber2;
	Service service;

	public Agency() {
		id = "";
		name = "";
		address = "";
		zipCode = "";
		url = "";
		phoneNumber1 = "";
		phoneNumber2 = "";
		service = new Service();
	}

}