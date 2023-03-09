from numpy import genfromtxt
from sqlalchemy import create_engine, Column, String, Integer, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import csv
import pandas as pd


# def load_csv(file_name):
#     data = genfromtxt(file_name, delimiter=',', skiprows=1,
#                       converters={0: lambda s: str(s)})
#     return data.tolist()


Base = declarative_base()


class Report(Base):
    __tablename__ = "Report"

    report_id = Column(Integer, primary_key=True)
    dependency_name = Column(String)
    description = Column(String)
    vulnerability = Column(String)
    severity_description = Column(String)
    severity_score = Column(Float)

    # def __init__(self, report_id, dependency_name, description, vulnerability, severity_description, severity_score):
    #     self.report_id = report_id
    #     self.dependency_name = dependency_name
    #     self.description = description
    #     self.vulnerability = vulnerability
    #     self.severity_description = severity_description
    #     self.severity_score = severity_score


if __name__ == '__main__':
    engine = create_engine('sqlite:///csv_report.db', echo=True)
    Base.metadata.create_all(bind=engine)

    file_name = 'dependency-check-report.csv'
    df = pd.read_csv(file_name)
    specific_df = df[["DependencyName", "Description", "Vulnerability"]]
    specific_df.to_sql(con=engine, index_label='id',
                       name=Report.__tablename__, if_exists='replace')
