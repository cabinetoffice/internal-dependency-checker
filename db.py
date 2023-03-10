from numpy import genfromtxt
from sqlalchemy import create_engine, Column, String, Integer, Float
# from sqlalchemy.ext.declarative import DeclarativeBase
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import csv
import pandas as pd


# def load_csv(file_name):
#     data = genfromtxt(file_name, delimiter=',', skiprows=1,
#                       converters={0: lambda s: str(s)})
#     return data.tolist()


class Base(DeclarativeBase):
    pass


class Report(Base):
    __tablename__ = "Report"

    report_id = Column(Integer, primary_key=True)
    dependency_name = Column(String)
    description = Column(String)
    vulnerability = Column(String)
    severity_description = Column(String)
    severity_score = Column(Float)


if __name__ == '__main__':
    engine = create_engine('sqlite:///csv_report.db', echo=True)
    # Base.metadata.create_all(bind=engine)

    file_name = 'dependency-check-report.csv'
    df = pd.read_csv(file_name, usecols=[
                     2, 4, 12, 17, 18], skiprows=1, header=None)

    # specific_df = df[["DependencyName", "Description", "Vulnerability"]]

    print(df)
    # print(specific_df)

    # df.to_sql(con=engine, index_label='id',
    #           name=Report.__tablename__, if_exists='append')
