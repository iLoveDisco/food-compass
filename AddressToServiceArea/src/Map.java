import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Map {
	public static ArrayList<Agency> buildAgencies() {
		Scanner agencyScanner = null;
		try {
			// agencyScanner = new Scanner(new File("/Users/tuey/AgencyCSV.csv"));
			agencyScanner = new Scanner(new File("directory"));
		} catch (FileNotFoundException exception) {
			exception.printStackTrace();
		}
		agencyScanner.useDelimiter(",");

		ArrayList<Agency> database = new ArrayList<>();// Database of Agencies

		List<String> lines = new ArrayList<>();
		while (agencyScanner.hasNext()) {
			String line = agencyScanner.nextLine();
			String[] words = line.split(",");
			Agency a = new Agency();
			a.id = words[0];
			a.name = words[2];
			a.address = words[4];
			a.zipCode = words[8];
			a.url = words[9];
			a.phoneNumber1 = words[10];
			a.phoneNumber2 = words[11];
			database.add(a);
		}
		return database;
	}

	public static ArrayList<Service> buildServices() {
		Scanner serviceScanner = null;
		try {
			// serviceScanner = new Scanner(new File("/Users/tuey/serviceCSV.csv"));
			serviceScanner = new Scanner(new File("directory"));
		} catch (FileNotFoundException exception) {
			exception.printStackTrace();
		}
		serviceScanner.useDelimiter(",");

		ArrayList<Service> services = new ArrayList<>();

		List<String> moreLines = new ArrayList<>();
		while (serviceScanner.hasNext()) {
			String line = serviceScanner.nextLine();
			String[] words = line.split(",");
			Service s = new Service();
			s.id = words[0];
			s.description = words[3];
			s.hours = words[4];
			s.eligibility = words[5];
			s.intakeProcedure = words[6];
			s.whatToBring = words[7];
			s.serviceArea = words[8];
			services.add(s);
		}

		return services;
	}

	public static void main(String[] args) throws FileNotFoundException {
		ArrayList<Agency> agencies = buildAgencies();
		ArrayList<Service> services = buildServices();
		for (Agency a : agencies) {
			for (Service s : services) {
				if (a.id.equals(s.id)) {
					a.service = s;
				}
			}
		}
		System.out.println(jsStringify(agencies));

	}

	public static String jsStringify(ArrayList<Agency> agencies) {
		String output = "const database = [";
		for (Agency a : agencies) {
			String object = "{";
			object += "id: \"" + a.id + "\", ";
			object += "name: \"" + a.name + "\", ";
			object += "address: \"" + a.address + "\", ";
			object += "zipcode: \"" + a.zipCode + "\", ";
			object += "url: \"" + a.url + "\", ";
			object += "phonenumber1: \"" + a.phoneNumber1 + "\", ";
			object += "phonenumber2: \"" + a.phoneNumber2 + "\", ";

			object += "service: " + "{";
			object += "id: \"" + a.service.id + "\", ";
			object += "description: \"" + a.service.description + "\", ";
			object += "servicearea: \"" + a.service.serviceArea + "\", ";
			object += "hours: \"" + a.service.hours + "\", ";
			object += "eligibility: \"" + a.service.eligibility + "\", ";
			object += "intakeprocedures: \"" + a.service.intakeProcedure + "\", ";
			object += "whattobring: \"" + a.service.whatToBring + "\", ";
			object += "servicearea: \"" + a.service.serviceArea + "\"";
			object += "}}";

			output += object + "," + '\n';
		}

		return output.substring(0, output.length() - 1) + "]";
	}
}
