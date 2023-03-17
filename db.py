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
    scan_type: Mapped[str] = mapped_column(String(20))
    severity_description: Mapped[str] = mapped_column(
        String(1000))
    severity_score: Mapped[float] = mapped_column(Float)


def filter_csv(file_dir):
    df = pd.read_csv(file_dir, usecols=[
                     2, 4, 12, 13, 17, 18], names=['dependency_name', 'description', 'vulnerability', 'scan_type', 'severity_description', 'severity_score'], header=0)

    remove_null_values = pd.notnull(df['severity_score'])

    return df[remove_null_values]


def csv_to_database(file_dir):
    df = filter_csv(file_dir)

    engine = create_engine('sqlite:///csv_report.db', echo=True)
    Base.metadata.create_all(bind=engine)

    df.to_sql(con=engine, index_label='report_id',
              name=Report.__tablename__, if_exists='append')


def csv_to_json(file_dir):
    df = filter_csv(file_dir)

    df.to_json(path_or_buf='repos/ova-alpha/report.json', orient='index')


if __name__ == '__main__':
    file_dir = ('repos/ova-alpha/dependency-check-report.csv')

    filter_csv(file_dir)

    csv_to_json(file_dir)
    csv_to_database(file_dir)
