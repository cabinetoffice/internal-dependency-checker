from numpy import genfromtxt
from sqlalchemy import create_engine, String, Integer, Float
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
import pandas as pd


class Base(DeclarativeBase):
    pass


class Report(Base):
    __tablename__ = "Report"

    report_id: Mapped[int] = mapped_column(primary_key=True)
    dependency_name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(1000))
    vulnerability: Mapped[str] = mapped_column(String(1000))
    severity_description: Mapped[str] = mapped_column(
        String(1000), nullable=True)
    severity_score: Mapped[float] = mapped_column(Float, nullable=True)


if __name__ == '__main__':

    engine = create_engine('sqlite:///csv_report.db', echo=True)
    Base.metadata.create_all(bind=engine)

    file_name = 'dependency-check-report.csv'

    df = pd.read_csv(file_name, usecols=[
                     2, 4, 12, 17, 18], names=['dependency_name', 'description', 'vulnerability', 'severity_description', 'severity_score'], header=0)

    df.to_sql(con=engine, index_label='report_id',
              name=Report.__tablename__, if_exists='append')
