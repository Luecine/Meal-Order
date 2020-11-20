public class Payroll
{
    private PayrollDB db;
    private Employee e;

    public void doPayroll()
    {
        e = db.getEmployee(id);

        if(e.isPayDay())
        {
            e.calcuatePay();
        }
    
    }


}

public class PayrollDB
{
    public Employee getEmployee(ID id);
}

public class Employee
{
    public boolean isPayDay();
    public int calcuatePay()
    {
        return pay;
    }
}